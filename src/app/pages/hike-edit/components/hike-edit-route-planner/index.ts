import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AdminMap, AdminMapService, WaypointMarkerService, RoutingControlService, RoutePlannerService
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
import { ReverseGeocodingService } from 'app/shared/services';

@Component({
  selector: 'gt-hike-edit-route-planner',
  templateUrl: './ui.html'
})
export class HikeEditRoutePlannerComponent implements OnInit, OnDestroy {
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  public route$: Observable<any>;
  public isPlanning$: Observable<boolean>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _map: AdminMap;

  constructor(
    private _adminMapService: AdminMapService,
    private _routingControlService: RoutingControlService,
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
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

    this.isPlanning$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsPlanning)
      .takeUntil(this._destroy$);

    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .switchMap((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
        return this._store
          .select(this._editedHikeProgramSelectors.getRouteId)
          .takeUntil(this._destroy$)
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
          this._toasterService.pop('success', 'Route', 'Success!');

          this._routePlannerService.refreshRouteOnMap();
        // Route loaded
        } else if (routeContext.loaded) {
          this._store
            .select(this._routeSelectors.getRoute((<IRouteContextState>routeContext).id))
            .filter((route: IRouteStored) => !!route)
            .take(1)
            .subscribe((route: IRouteStored) => {
              // Draw an independent path to the map
              this._routePlannerService.drawRouteLineGeoJSON(route.route.features[0]);
              this._map.fitBounds(route);

              // Load path to routePlanner state - necessary for drawing pois
              this._routePlannerService.addRouteToTheStore(route.route);
            });
        }
      });

    this.route$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoute)
      .takeUntil(this._destroy$);

    this.route$
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
        const fields = _.pick(total, ['distance', 'uphill', 'downhill', 'time', 'score']);
        if (_.values(fields).length > 0) {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(fields, true));
        }
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public retrievePlan() {
    this._store
      .select(this._editedHikeProgramSelectors.getRouteId)
      .take(1)
      .switchMap((routeId: string) => this._store.select(this._routeSelectors.getRoute(routeId)).take(1))
      .take(1)
      .subscribe((storedRoute: any) => {
        this._waypointMarkerService.reset();

        Observable
          .interval(500)
          .take(storedRoute.route.features.length)
          .subscribe((idx) => {
            const feature = storedRoute.route.features[idx];
            if (feature.geometry.type === 'Point') {
              this._waypointMarkerService.addWaypoint(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
            }
          });

        // Enable planning
        this._store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(true));
      });
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
}
