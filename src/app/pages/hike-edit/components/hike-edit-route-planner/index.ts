import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AdminMap, AdminMapService, WaypointMarkerService, RoutingControlService
} from 'app/shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State, IHikeEditRoutePlannerState, hikeEditRoutePlannerActions,
  commonHikeActions, commonRouteActions, editedHikeProgramActions, IHikeEditRoutePlannerTotalState
} from 'app/store';
import { RouteSelectors, IRouteContextState, Route } from 'subrepos/gtrack-common-ngx';
import { HikeEditMapSelectors, HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors } from 'app/store/selectors';
import { IRouteStored } from 'subrepos/provider-client';
import { ToasterService } from 'angular2-toaster';

import * as L from 'leaflet';
import * as _ from 'lodash';
import { ReverseGeocodingService } from '../../../../shared/services';

@Component({
  selector: 'gt-hike-edit-route-planner',
  templateUrl: './ui.html'
})
export class HikeEditRoutePlannerComponent implements OnInit, OnDestroy {
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _map: AdminMap;
  private _routeId: string;
  private _routeOnMap: L.FeatureGroup;

  constructor(
    private _adminMapService: AdminMapService,
    private _routingControlService: RoutingControlService,
    private _waypointMarkerService: WaypointMarkerService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _routeSelectors: RouteSelectors,
    private _toasterService: ToasterService,
    private _store: Store<State>,
    private _reverseGeocodingService: ReverseGeocodingService
  ) {}

  ngOnInit() {

    this.routeInfoData$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .takeUntil(this._destroy$);

    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .switchMap((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);

        return this._store.select(this._editedHikeProgramSelectors.getRouteId)
      })
      .takeUntil(this._destroy$)
      .switchMap((routeId: string) => {
        return this._store
          .select(this._routeSelectors.getRouteContext(routeId))
          .takeUntil(this._destroy$);
      })
      .filter(routeContext => !!routeContext)
      .subscribe((routeContext: IRouteContextState) => {
        // Route saved
        if (routeContext.saved) {
          this._toasterService.pop('success', 'Success!', 'Route saved!');
        // Route loaded
        } else if (routeContext.loaded) {
          this._store
            .select(this._routeSelectors.getRoute((<IRouteContextState>routeContext).id))
            .take(1)
            .subscribe((route: IRouteStored) => {
              this._routeOnMap = this._addRouteLineGeoJSON(route.route.features[0]);
            });
        }
      });

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoute)
      .takeUntil(this._destroy$)
      .subscribe((route: any) => {
        // Clear location
        if (route.features.length === 1) {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: '' }, false));
        // 1st segment added (line + 2 points)
        } else if (route.features.length === 3) {
          this._updateLocation(route.features[1].geometry.coordinates);
        }
      });

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getTotal)
      .takeUntil(this._destroy$)
      .subscribe((total: IHikeEditRoutePlannerTotalState) => {
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(
          _.pick(total, ['distance', 'uphill', 'downhill', 'time', 'score']), true
        ));
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public retrievePlan() {
    console.log('TODO retrievePlan');
  }

  public removeLast() {
    this._waypointMarkerService.deleteLast();
  }

  public closeCircle() {
    this._waypointMarkerService.closeCircle();
  }

  public deletePlan() {
    this._waypointMarkerService.reset();
    this._routingControlService.clearControls();
  }

  /*
  private _loadRoute(routeData: IRouteStored) {
    if (this._map && this._waypointMarkerService) {
      for (let feature of routeData.route.features) {
        if (feature.geometry.type === 'Point') {
          this._waypointMarkerService.addWaypoint(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ));
        }
      }
    }
  }
  */

  private _updateLocation(coords) {
    this._reverseGeocodingService
      .get({
        lat: coords[1],
        lon: coords[0]
      })
      .then((location: string) => {
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: location }, false));
      }, err => {
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: '' }, false));
      }
    );
  }

  /**
   * Create multi-line group from a LineString
   */
  private _addRouteLineGeoJSON(geoJson): L.FeatureGroup {
    const group = new L.FeatureGroup();
    const styles = [
      { color: 'black',   opacity: 0.15,  weight: 9 },
      { color: 'white',   opacity: 0.8,   weight: 6 },
      { color: '#722ad6', opacity: 1,     weight: 2 }
    ];

    for (let num of [0, 1, 2]) {
      group.addLayer(L.geoJSON(geoJson, {
        style: <any>styles[num]
      }));
    }
    group.addTo(this._map.leafletMap);

    return group;
  }
}
