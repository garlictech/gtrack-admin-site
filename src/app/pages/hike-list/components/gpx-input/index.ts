import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import { RouteService } from 'subrepos/gtrack-common-ngx';

// Core
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as toGeoJSON from '@mapbox/togeojson';

import { HikeProgramService } from '../../../../shared/services';

const _loadFile = async (file: any): Promise<any> =>
  new Promise((resolve, reject) => {
    const _reader: FileReader = new FileReader();
    _reader.onloadend = e => {
      resolve(_reader.result);
    };
    _reader.onerror = e => {
      reject();
    };
    _reader.readAsText(file);
  });

/**
 * Fix MultiLineString if needed (convert to single LineString)
 */
const _checkAndFixMultiLineString = (route: any): void => {
  const _geometry = _get(route, 'features[0].geometry');
  let _lineString: Array<Array<number>> = [];

  if (_geometry && _geometry.type === 'MultiLineString') {
    for (const i in _geometry.coordinates) {
      if (_geometry.coordinates[i]) {
        const coords = _geometry.coordinates[i];

        _lineString = (i as any) === 0 ? _lineString.concat(coords) : _lineString.concat(coords.slice(1));
      }
    }

    _geometry.type = 'LineString';
    _geometry.coordinates = _cloneDeep(_lineString);
  }
};

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

  openGPX(): void {
    this.gpxInput.nativeElement.click();
  }

  gpxInputListener($event): void {
    const file = $event.target.files[0];

    if (file) {
      _loadFile(file).then(
        (content: string) => {
          const _doc = new DOMParser().parseFromString(content, 'application/xml');
          const _route = toGeoJSON.gpx(_doc);

          _checkAndFixMultiLineString(_route);

          this._hikeProgramService.gpxRoute = {
            route: _route,
            bounds: this._routeService.getBounds(_route)
          };

          // tslint:disable-next-line:no-floating-promises
          this._router.navigate(['/admin/hike/new']);
        },
        () => {
          /**/
        }
      );
    }
  }
}
