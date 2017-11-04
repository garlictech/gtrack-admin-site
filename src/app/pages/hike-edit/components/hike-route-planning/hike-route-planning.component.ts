import { Component, AfterViewInit } from '@angular/core';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';

@Component({
  selector: 'gt-hike-route-planning',
  templateUrl: './hike-route-planning.component.html',
  styleUrls: ['./hike-route-planning.component.scss']
})
export class HikeRoutePlanningComponent implements AfterViewInit {
  private _map: AdminMap;

  constructor(private _adminMapService: AdminMapService) {}

  ngAfterViewInit() {
    this._map = this._adminMapService.getMapById('hike-map');
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
    console.log('todo: saveRoute');
    /*
    AsyncRequestExecutor.execute scope, RoutePlannerService.saveTrack(scope.hike._rawData).then ->
    RoutePlannerService.deletePlan()
    */
  }
}
