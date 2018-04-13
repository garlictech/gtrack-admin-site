import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AdminMap, AdminMapService, WaypointMarkerService, RoutingControlService
} from 'app/shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State, IHikeEditRoutePlannerState, hikeEditRoutePlannerActions,
  commonHikeActions, commonRouteActions, IHikeEditGeneralInfoState
} from 'app/store';
import { RouteSelectors, IRouteContextState, Route } from 'subrepos/gtrack-common-ngx';
import { HikeEditMapSelectors, HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IRoute } from 'subrepos/provider-client';
import { ToasterService } from 'angular2-toaster';

import * as L from 'leaflet';

@Component({
  selector: 'gt-hike-edit-route-planner',
  templateUrl: './hike-edit-route-planner.component.html'
})
export class HikeEditRoutePlannerComponent implements OnInit, OnDestroy {
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _map: AdminMap;
  private _routeId: string;

  constructor(
    private _adminMapService: AdminMapService,
    private _routingControlService: RoutingControlService,
    private _waypointMarkerService: WaypointMarkerService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _routeSelectors: RouteSelectors,
    private _toasterService: ToasterService,
    private _store: Store<State>
  ) {}

  ngOnInit() {
    this.routeInfoData$ = this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner);

    this._store.select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Show toaster when the route has been saved
    this._store.select(this._hikeEditGeneralInfoSelectors.getRouteId)
      .switchMap((routeId: string) => {
        return this._store
          .select(this._routeSelectors.getRouteContext(routeId))
          .takeUntil(this._destroy$);
      })
      .filter(routeContext => !!(routeContext && routeContext.saved))
      .takeUntil(this._destroy$)
      .subscribe((routeContext) => {
        this._toasterService.pop('success', 'Success!', 'Route saved!');
      });

    // Handling route load
    this._store.select(this._hikeEditGeneralInfoSelectors.getRouteId)
      .switchMap((routeId: string) => {
        return this._store
          .select(this._routeSelectors.getRouteContext(routeId))
          .takeUntil(this._destroy$);
      })
      .filter(routeContext => !!(routeContext && routeContext.loaded))
      .switchMap((routeContext) => {
        return this._store
          .select(this._routeSelectors.getRoute((<IRouteContextState>routeContext).id))
          .takeUntil(this._destroy$);
      })
      .take(1)
      .subscribe((route) => {
        setTimeout(() => {
          this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());

          // Todo: load route only on init
          this._loadRoute(<Route>route);
        });
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

  private _loadRoute(routeData: Route) {
    if (this._map && this._waypointMarkerService) {
      const coords: L.LatLng[] = [];
      for (let feature of routeData.route.features) {
        if (feature.geometry.type === 'Point') {
          coords.push(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ));
        }
      }

      this._waypointMarkerService.addWaypointList(coords);
    }
  }
}
