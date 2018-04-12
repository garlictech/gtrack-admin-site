import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

import * as L from 'leaflet';
import { RoutingControlService } from '.';

@Injectable()
export class WaypointMarkerService {
  private _maxAllowedValhallaWayPoints = 2; // TOO: deprecated???
  private _routeSegmentIndex: number;
  private _waypointIndex: number;

  constructor(
    private _store: Store<State>,
    private _routingControlService: RoutingControlService
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
      this._routingControlService.pop();
      this._routeSegmentIndex--;
      this._waypointIndex = this._maxAllowedValhallaWayPoints;
    } else if (_isFirstWaypointInFirstSegment) {
      this.reset();
      this._routingControlService.clearControls();
    } else if (_isSecondWaypoint) {
      const _control = this._routingControlService.getActualControl();
      const _latlng = _control.getWaypoints()[0].latLng;

      this.reset();

      this._routingControlService.clearControls();
      this.addWaypoint(_latlng);
    } else {
      const _control = this._routingControlService.getActualControl();
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
    const _firstControl: L.Routing.Control = this._routingControlService.getControl(0);

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
      _control = this._routingControlService.addNew();

      this._routeSegmentIndex = 1;
      this._waypointIndex = 0;
    } else if (_shouldAddNewSegment) {
      const _previousControl = this._routingControlService.getActualControl();
      const _waypoints = _previousControl.getWaypoints();
      const _lastWaypoint = _waypoints[_waypoints.length - 1];

      _control = this._routingControlService.addNew();
      _control.spliceWaypoints(0, 1, _lastWaypoint);

      this._waypointIndex = 1;
      this._routeSegmentIndex++;
    } else {
      _control = this._routingControlService.getActualControl();
    }

    const _waypoint = {
      latLng: latlng,
      name: this._getWaypointNum() + 1
    }

    _control.spliceWaypoints(this._waypointIndex, 1, _waypoint);
    _control.route();
    this._waypointIndex++;
  }
}