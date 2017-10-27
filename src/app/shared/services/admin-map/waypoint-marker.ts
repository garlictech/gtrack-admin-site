import { RouteInfo } from './route-info';
import { RoutingControl } from './routing-control';
import * as L from 'leaflet';

export class WaypointMarker {
  private _maxAllowedValhallaWayPoints = 2;
  private _routeSegmentIndex: number;
  private _waypointIndex: number;

  constructor(
    private _routeInfo: RouteInfo,
    private _routingControl: RoutingControl
  ) {
    this.reset();
  }

  public reset() {
    this._routeSegmentIndex = 0;
    this._waypointIndex = 0;
  }

  public deleteLast() {
    const isEmpty = this._getWaypointNum() === 0;
    const isLastWaypointInAdditionalSegment = this._routeSegmentIndex > 1 && this._waypointIndex === 2;
    const isFirstWaypointInFirstSegment = this._routeSegmentIndex === 1 && this._waypointIndex === 1;
    const isSecondWaypoint = this._routeSegmentIndex === 1 && this._waypointIndex === 2;

    if (isEmpty) {
      return;
    }

    if (isLastWaypointInAdditionalSegment) {
      this._routingControl.pop();
      this._routeSegmentIndex--;
      this._waypointIndex = this._maxAllowedValhallaWayPoints;
    } else if (isFirstWaypointInFirstSegment) {
      this.reset();
      this._routingControl.clearControls();
    } else if (isSecondWaypoint) {
      const control = this._routingControl.getActualControl();
      const latlng = control.getWaypoints()[0].latLng;

      this._routeInfo.deletePlan();
      this.reset();

      this._routingControl.clearControls();
      this.addWaypoint(latlng);
    } else {
      const control = this._routingControl.getActualControl();

      control.spliceWaypoints(this._waypointIndex - 1, 1);
      this._waypointIndex--;
      control.route();
    }
  }

  /**
   * The first segment contains _maxAllowedValhallaWayPoints.
   * The other segments contain _maxAllowedValhallaWayPoints - 1 points,
   * as their first point is always duplicate of the last point of the previous segment.
   * So, in case of first segment, we adjust the number...
   */
  private _getWaypointNum() {
    if (this._routeSegmentIndex === 0) {
      return 0;
    } else if (this._routeSegmentIndex === 1) {
      return this._waypointIndex;
    } else {
      return (this._routeSegmentIndex - 1) * (this._maxAllowedValhallaWayPoints - 1) + this._waypointIndex;
    }
  }

  public closeCircle() {
    const firstControl: L.Routing.Control = this._routingControl.getControl(0);

    if (firstControl && firstControl.getWaypoints().length) {
      const firstPointLatLng = firstControl.getWaypoints()[0].latLng;
      this.addWaypoint(firstPointLatLng);
    }
  }

  public addWaypoint(latlng) {
    let control: L.Routing.Control;
    const isStartRouting = this._getWaypointNum() === 0;
    const shouldAddNewSegment = this._waypointIndex === this._maxAllowedValhallaWayPoints;

    if (isStartRouting) {
      this._routeInfo.newPlan();

      control = this._routingControl.addNew();

      this._routeSegmentIndex = 1;
      this._waypointIndex = 0;
    } else if (shouldAddNewSegment) {
      const previousControl = this._routingControl.getActualControl();
      const waypoints = previousControl.getWaypoints();
      const lastWaypoint = waypoints[waypoints.length - 1];

      control = this._routingControl.addNew();
      control.spliceWaypoints(0, 1, lastWaypoint);

      this._waypointIndex = 1;
      this._routeSegmentIndex++;
    } else {
      control = this._routingControl.getActualControl();
    }

    const waypoint = {
      latLng: latlng,
      name: this._getWaypointNum() + 1
    }

    control.spliceWaypoints(this._waypointIndex, 1, waypoint);
    control.route();
    this._waypointIndex++;
  }
}
