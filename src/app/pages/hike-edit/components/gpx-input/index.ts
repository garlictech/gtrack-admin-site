// Core
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { RoutePlannerService, AdminMapService, WaypointMarkerService } from '../../../../shared/services/admin-map';
import { HikeEditMapSelectors } from '../../../../store/selectors';
import { RouteService } from 'subrepos/gtrack-common-ngx';
import { IRoute } from 'subrepos/provider-client';

import * as L from 'leaflet';
import * as toGeoJSON from '@mapbox/togeojson';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

@Component({
  selector: 'gt-gpx-input',
  templateUrl: 'ui.html'
})
export class GpxInputComponent {
  @Input() callback: any;
  @ViewChild('gpxInput') gpxInput: ElementRef;
  public gpxRoute: IRoute;

  constructor(
    private _store: Store<State>,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _routePlannerService: RoutePlannerService,
    private _waypointMarkerService: WaypointMarkerService,
    private _adminMapService: AdminMapService,
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
        this.gpxRoute = {
          route: _route,
          bounds: this._routeService.getBounds(_route)
        }

        // Draw an independent path to the map
        this._routePlannerService.drawRouteLineGeoJSON(this.gpxRoute.route.features[0]);

        // Load path to routePlanner state - necessary for drawing pois
        this._routePlannerService.addRouteToTheStore(this.gpxRoute.route);

        this._store
          .select(this._hikeEditMapSelectors.getMapId)
          .filter(id => id !== '')
          .take(1)
          .subscribe((mapId: string) => {
            const _map = this._adminMapService.getMapById(mapId);
            _map.fitBounds(this.gpxRoute);
          });
      })
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

  public route() {
    const _segments = turf.lineChunk(this.gpxRoute.route, 10, {units: 'kilometers'});

    Observable
      .interval(500)
      .take(_segments.features.length)
      .subscribe((idx) => {
        const _coords = _.get(_segments.features[idx], 'geometry.coordinates', null);
        const _firstCoord = _.first(_coords);
        this._waypointMarkerService.addWaypoint(L.latLng((<any>_firstCoord)[1], (<any>_firstCoord)[0]));

        // Add the last coord of the last segment
        if (idx === _segments.features.length - 1) {
          const _lastCoord = _.last(_coords);
          this._waypointMarkerService.addWaypoint(L.latLng((<any>_lastCoord)[1], (<any>_lastCoord)[0]));
        }
      });
  }
}
