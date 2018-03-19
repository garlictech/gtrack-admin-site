import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
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

import * as _ from 'lodash';
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
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _routeSelectors: RouteSelectors,
    private _toasterService: ToasterService,
    private _store: Store<State>
  ) {}

  ngOnInit() {
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());

    this.routeInfoData$ = this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner);

    this._store.select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Show toaster when the route has been saved
    this._store.select(this._hikeEditGeneralInfoSelectors.getRouteId)
      .takeUntil(this._destroy$)
      .switchMap((routeId: string) => this._store.select(this._routeSelectors.getRouteContext(routeId)))
      .filter(routeContext => !!(routeContext && routeContext.saved))
      .subscribe((routeContext) => {
        this._toasterService.pop('success', 'Success!', 'Route saved!');
      });

    // Handling route load
    this._store.select(this._hikeEditGeneralInfoSelectors.getRouteId)
      .takeUntil(this._destroy$)
      .switchMap((routeId: string) => this._store.select(this._routeSelectors.getRouteContext(routeId)))
      .filter(routeContext => !!(routeContext && routeContext.loaded))
      .switchMap((routeContext) => this._store.select(this._routeSelectors.getRoute((<IRouteContextState>routeContext).id)))
      .take(1)
      .subscribe((route) => {
        this._loadRoute(<Route>route);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public retrievePlan() {
    this._map.waypointMarker.deleteLast();
  }

  public removeLast() {
    this._map.waypointMarker.deleteLast();
  }

  public closeCircle() {
    this._map.waypointMarker.closeCircle();
  }

  public deletePlan() {
    this._map.routeInfo.deletePlan();
    this._map.waypointMarker.reset();
    this._map.routingControl.clearControls();
  }

  public saveRoute() {
    const _routePlannerState: Observable<any> = this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .take(1)

    const _generalInfoState: Observable<any> = this._store
      .select(this._hikeEditGeneralInfoSelectors.getRouteId)
      .take(1)

    Observable.forkJoin(_routePlannerState, _generalInfoState)
      .subscribe(data => {
        if (data[0] && data[1]) {
          let _route: IRoute = {
            id: data[1],
            bounds: data[0].route.bounds,
            route: _.pick(data[0].route, ['type', 'features'])
          };

          this._store.dispatch(new commonRouteActions.SaveRoute(_route));
        }
      });
  }

  private _loadRoute(routeData: Route) {
    console.log('routeData', routeData);

    for (let i = 1; i < routeData.route.features.length; i++) {
      let latlng = L.latLng(
        routeData.route.features[i].geometry.coordinates[1],
        routeData.route.features[i].geometry.coordinates[0]
      );

      this._map.waypointMarker.addWaypoint(latlng);
    }
  }
}
