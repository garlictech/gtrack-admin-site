import { Component } from '@angular/core';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  State,
  IRouteInfoDataState,
  hikeEditroutePlanningActions,
  commonHikeActions,
  commonRouteActions
} from 'app/store';
import { HikeEditMapSelectors } from 'app/store/selectors';
import { IRoute } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'gt-hike-edit-route-planning',
  templateUrl: './hike-edit-route-planning.component.html'
})
export class HikeEditRoutePlanningComponent {
  public routeInfoData$: Observable<IRouteInfoDataState>;
  private _map: AdminMap;

  constructor(
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _store: Store<State>
  ) {
    this.routeInfoData$ = this._store.select((state: State) => state.routeInfoData);

    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });
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
    this._store.select((state: State) => state.routeInfoData)
      .take(1)
      .subscribe((routeInfoData) => {
        if (routeInfoData) {
          let _route: IRoute = {
            bounds: routeInfoData.route.bounds,
            route: routeInfoData.route,
          }

          this._store.dispatch(new commonRouteActions.CreateRoute(_route));
        }
      });

    /*
    _rawData: firebaseObject volt!
    AsyncRequestExecutor.execute scope, RoutePlannerService.saveTrack(scope.hike._rawData).then ->
    RoutePlannerService.deletePlan()
    */
  }
}
