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
    const _isEmpty = this._getWaypointNum() === 0;
    const _isLastWaypointInAdditionalSegment = this._routeSegmentIndex > 1 && this._waypointIndex === 2;
    const _isFirstWaypointInFirstSegment = this._routeSegmentIndex === 1 && this._waypointIndex === 1;
    const _isSecondWaypoint = this._routeSegmentIndex === 1 && this._waypointIndex === 2;

    if (_isEmpty) {
      return;
    }

    if (_isLastWaypointInAdditionalSegment) {
      this._routingControl.pop();
      this._routeSegmentIndex--;
      this._waypointIndex = this._maxAllowedValhallaWayPoints;
    } else if (_isFirstWaypointInFirstSegment) {
      this.reset();
      this._routingControl.clearControls();
    } else if (_isSecondWaypoint) {
      const _control = this._routingControl.getActualControl();
      const _latlng = _control.getWaypoints()[0].latLng;

      this._routeInfo.deletePlan();
      this.reset();

      this._routingControl.clearControls();
      this.addWaypoint(_latlng);
    } else {
      const _control = this._routingControl.getActualControl();
      _control.spliceWaypoints(this._waypointIndex - 1, 1);
      this._waypointIndex--;
      _control.route();
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
    const _firstControl: L.Routing.Control = this._routingControl.getControl(0);

    if (_firstControl && _firstControl.getWaypoints().length) {
      const firstPointLatLng = _firstControl.getWaypoints()[0].latLng;
      this.addWaypoint(firstPointLatLng);
    }
  }

  public addWaypoint(latlng) {
    let _control: L.Routing.Control;
    const _isStartRouting = this._getWaypointNum() === 0;
    const _shouldAddNewSegment = this._waypointIndex === this._maxAllowedValhallaWayPoints;

    if (_isStartRouting) {
      console.log('START ROUTING');
      this._routeInfo.newPlan();

      _control = this._routingControl.addNew();

      this._routeSegmentIndex = 1;
      this._waypointIndex = 0;
    } else if (_shouldAddNewSegment) {
      console.log('START ROUTING _shouldAddNewSegment');
      const previousControl = this._routingControl.getActualControl();
      const waypoints = previousControl.getWaypoints();
      const lastWaypoint = waypoints[waypoints.length - 1];

      _control = this._routingControl.addNew();
      _control.spliceWaypoints(0, 1, lastWaypoint);

      this._waypointIndex = 1;
      this._routeSegmentIndex++;
    } else {
      console.log('START ROUTING ELSE');
      _control = this._routingControl.getActualControl();
    }

    const waypoint = {
      latLng: latlng,
      name: this._getWaypointNum() + 1
    }

    _control.spliceWaypoints(this._waypointIndex, 1, waypoint);
    _control.route();
    this._waypointIndex++;
  }
}
