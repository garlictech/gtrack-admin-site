import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State, IHikeEditRoutePlannerState, hikeEditRoutePlannerActions,
  commonHikeActions, commonRouteActions, IHikeEditGeneralInfoState
} from 'app/store';
import { RouteSelectors } from 'subrepos/gtrack-common-ngx';
import { HikeEditMapSelectors, HikeEditGeneralInfoSelectors } from 'app/store/selectors';
import { IRoute } from 'subrepos/provider-client';
import { ToasterService } from 'angular2-toaster';

import * as _ from 'lodash';

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
    private _routeSelectors: RouteSelectors,
    private _toasterService: ToasterService,
    private _store: Store<State>
  ) {
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
  }

  ngOnInit() {
    this.routeInfoData$ = this._store.select((state: State) => state.hikeEditRoutePlanner);

    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .skipWhile(id => id === '')
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this._store.select((state: State) => state.hikeEditGeneralInfo.generalInfo.routeId)
      .takeUntil(this._destroy$)
      .switchMap((routeId: string) => {
        return this._store.select(this._routeSelectors.getRouteContext(routeId))
      })
      .skipWhile(routeContext => !routeContext || (routeContext && !routeContext.saved))
      .subscribe((routeContext) => {
        this._toasterService.pop('success', 'Success!', 'Route saved!');
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
      .select((state: State) => state.hikeEditRoutePlanner)
      .take(1)

    const _generalInfoState: Observable<any> = this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikeEditGeneralInfoSelector())
      .take(1)

    Observable.forkJoin(_routePlannerState, _generalInfoState)
      .subscribe(data => {
        if (data[0] && data[1]) {
          let _route: IRoute = {
            id: data[1].routeId,
            bounds: data[0].route.bounds,
            route: _.pick(data[0].route, ['type', 'features'])
          };

          this._store.dispatch(new commonRouteActions.SaveRoute(_route));
        }
      });
  }
}
