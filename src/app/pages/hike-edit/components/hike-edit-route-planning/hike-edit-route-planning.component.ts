import { Component } from '@angular/core';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, HikeEditRoutePlanningActions } from '../../../../store';

@Component({
  selector: 'gt-hike-edit-route-planning',
  templateUrl: './hike-edit-route-planning.component.html',
  styleUrls: ['./hike-edit-route-planning.component.scss']
})
export class HikeEditRoutePlanningComponent {
  private _map: AdminMap;
  private _mapId$: Observable<string>;

  constructor(
    private _adminMapService: AdminMapService,
    private _store: Store<State>,
    private _actions: HikeEditRoutePlanningActions
  ) {
    // Kell ez egyáltalán????
    this._mapId$ = this._store.select((state: State) => state.hikeEditMap.mapId);

    this._mapId$
      .skipWhile(mapId => mapId === null)
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });
  }

  public retrievePlan() {
    this._store.dispatch(this._actions.retrievePlan());
    // TODO effect this._map.waypointMarker.deleteLast();
  }
  public removeLast() {
    this._store.dispatch(this._actions.removeLast());
    // this._map.waypointMarker.deleteLast();
  }

  public closeCircle() {
    this._store.dispatch(this._actions.closeCircle());
    // this._map.waypointMarker.closeCircle();
  }

  public deletePlan() {
    this._store.dispatch(this._actions.deletePlan());

    // this._map.routeInfo.deletePlan();
    // this._map.waypointMarker.reset();
    // this._map.routingControl.clearControls();
  }

  public saveRoute() {
    console.log('todo: saveRoute');
    this._store.dispatch(this._actions.saveRoute());
    /*
    AsyncRequestExecutor.execute scope, RoutePlannerService.saveTrack(scope.hike._rawData).then ->
    RoutePlannerService.deletePlan()
    */
  }
}
