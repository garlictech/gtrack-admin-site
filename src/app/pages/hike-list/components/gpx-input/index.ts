// Core
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../../../../store';
import { RoutePlannerService, AdminMapService, WaypointMarkerService } from '../../../../shared/services/admin-map';
import { HikeEditMapSelectors } from '../../../../store/selectors';
import { HikeProgramService } from '../../../../shared/services';
import { RouteService } from 'subrepos/gtrack-common-ngx';
import { IRoute } from 'subrepos/provider-client';

import * as toGeoJSON from '@mapbox/togeojson';
import * as _ from 'lodash';

@Component({
  selector: 'gt-gpx-input',
  templateUrl: 'ui.html',
  styles: ['input[type=file] { display: none; }']
})
export class GpxInputComponent {
  @Input() callback: any;
  @ViewChild('gpxInput') gpxInput: ElementRef;
  public gpxRoute: IRoute;

  constructor(
    private _router: Router,
    private _hikeProgramService: HikeProgramService,
    private _routeService: RouteService,
  ) {}

  public openGPX() {
    this.gpxInput.nativeElement.click();
  }

  public gpxInputListener($event) {
    const file = $event.target.files[0];

    if (file) {
      this._loadFile(file).then((content: string) => {
        const _doc = new DOMParser().parseFromString(content, 'application/xml');
        const _route = toGeoJSON.gpx(_doc);

        this._checkAndFixMultiLineString(_route);

        this._hikeProgramService.gpxRoute = {
          route: _route,
          bounds: this._routeService.getBounds(_route)
        }

        this._router.navigate(['/admin/hike/new']);
      });
    }
  }

  private _loadFile(file) {
    return new Promise((resolve, reject) => {
      const _reader: FileReader = new FileReader();
      _reader.onloadend = (e) => {
        resolve(_reader.result);
      }
      _reader.onerror = (e) => {
        reject();
      }
      _reader.readAsText(file);
    });
  }

  /**
   * Fix MultiLineString if needed (convert to single LineString)
   */
  private _checkAndFixMultiLineString(route) {
    const _geometry = _.get(route, 'features[0].geometry');
    let _lineString: number[][] = [];

    if (_geometry && _geometry.type === 'MultiLineString') {
      for (let i in _geometry.coordinates) {
        const coords = _geometry.coordinates[i];

        if (<any>i === 0) {
          _lineString = _lineString.concat(coords);
        } else {
          // Drop the 1st coord, it's same as the prev last coord...
          _lineString = _lineString.concat(coords.slice(1));
        }
      }

      _geometry.type = 'LineString';
      _geometry.coordinates = _.cloneDeep(_lineString);
    }
  }
}
