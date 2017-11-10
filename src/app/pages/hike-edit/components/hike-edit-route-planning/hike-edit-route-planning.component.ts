import { Component } from '@angular/core';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  State,
  HikeEditRoutePlanningActions,
  HikeEditMapActions,
  IRouteInfoDataState
} from '../../../../store';

@Component({
  selector: 'gt-hike-edit-route-planning',
  templateUrl: './hike-edit-route-planning.component.html',
  styleUrls: ['./hike-edit-route-planning.component.scss']
})
export class HikeEditRoutePlanningComponent {
  public routeInfoData$: Observable<IRouteInfoDataState>;
  private _map: AdminMap;

  constructor(
    private _adminMapService: AdminMapService,
    private _store: Store<State>,
    private _actions: HikeEditRoutePlanningActions,
    private _mapActions: HikeEditMapActions
  ) {
    this.routeInfoData$ = this._store.select((state: State) => state.routeInfoData);
    this._store.select((state: State) => state.hikeEditMap.mapId)
      .skipWhile(mapId => mapId === null)
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
    this._store.dispatch(this._mapActions.removeGeoJson());
  }

  public saveRoute() {
    console.log('todo: saveRoute');
    this._store.dispatch(this._actions.saveRoute());
    /*
    _rawData: firebaseObject volt!
    AsyncRequestExecutor.execute scope, RoutePlannerService.saveTrack(scope.hike._rawData).then ->
    RoutePlannerService.deletePlan()
    */
  }
}
