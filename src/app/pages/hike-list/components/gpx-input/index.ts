import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import { RouteService } from 'subrepos/gtrack-common-ngx';

// Core
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as toGeoJSON from '@mapbox/togeojson';

import { HikeProgramService } from '../../../../shared/services';

@Component({
  selector: 'app-gpx-input',
  templateUrl: 'ui.html',
  styles: ['input[type=file] { display: none; }']
})
export class GpxInputComponent {
  @Input() callback: any;
  @ViewChild('gpxInput') gpxInput: ElementRef;

  constructor(
    private readonly _router: Router,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _routeService: RouteService
  ) {}

  openGPX() {
    this.gpxInput.nativeElement.click();
  }

  gpxInputListener($event) {
    const file = $event.target.files[0];

    if (file) {
      this._loadFile(file).then((content: string) => {
        const _doc = new DOMParser().parseFromString(content, 'application/xml');
        const _route = toGeoJSON.gpx(_doc);

        this._checkAndFixMultiLineString(_route);

        this._hikeProgramService.gpxRoute = {
          route: _route,
          bounds: this._routeService.getBounds(_route)
        };

        this._router.navigate(['/admin/hike/new']);
      });
    }
  }

  private _loadFile(file) {
    return new Promise((resolve, reject) => {
      const _reader: FileReader = new FileReader();
      _reader.onloadend = e => {
        resolve(_reader.result);
      };
      _reader.onerror = e => {
        reject();
      };
      _reader.readAsText(file);
    });
  }

  /**
   * Fix MultiLineString if needed (convert to single LineString)
   */
  private _checkAndFixMultiLineString(route) {
    const _geometry = _get(route, 'features[0].geometry');
    let _lineString: Array<Array<number>> = [];

    if (_geometry && _geometry.type === 'MultiLineString') {
      for (const i in _geometry.coordinates) {
        if (_geometry.coordinates[i]) {
          const coords = _geometry.coordinates[i];

          if ((i as any) === 0) {
            _lineString = _lineString.concat(coords);
          } else {
            // Drop the 1st coord, it's same as the prev last coord...
            _lineString = _lineString.concat(coords.slice(1));
          }
        }
      }

      _geometry.type = 'LineString';
      _geometry.coordinates = _cloneDeep(_lineString);
    }
  }
}
