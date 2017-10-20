import { Injectable } from '@angular/core';
import { RoutingControlService } from '../routing-control/routing-control.service';

import * as L from 'leaflet';

@Injectable()
export class WaypointMarkerService {
  private _maxAllowedValhallaWayPoints = 2;
  private _routeSegmentIndex: number;
  private _waypointIndex: number;

  constructor(
    private _routingControlService: RoutingControlService
  ) {
    this._reset();
  }

  private _reset() {
    this._routeSegmentIndex = 0;
    this._waypointIndex = 0;
  }

  private _deleteLast() {
    const isEmpty = this._getWaypointNum() === 0;
    const isLastWaypointInAdditionalSegment = this._routeSegmentIndex > 1 && this._waypointIndex === 2;
    const isFirstWaypointInFirstSegment = this._routeSegmentIndex === 1 && this._waypointIndex === 1;
    const isSecondWaypoint = this._routeSegmentIndex === 1 && this._waypointIndex === 2;

    if (isEmpty) {
      return
    }

    if (isLastWaypointInAdditionalSegment) {
      // RoutingControlService.pop()
      this._routeSegmentIndex--;
      this._waypointIndex = this._maxAllowedValhallaWayPoints;
    } else if (isFirstWaypointInFirstSegment) {
      this._reset();
      // RoutingControlService.clearControls()
    } else if (isSecondWaypoint) {
      const control = this._routingControlService.getActualControl();
      const latlng = { ...control.getWaypoints()[0].latLng } // Object.assign() ?

      // RouteService.deletePlan();

      this._reset();
      this._routingControlService.clearControls();
      this.addWaypoint(latlng);
    } else {
      const control = this._routingControlService.getActualControl();
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

  private _closeCircle() {
    const firstControl = new L.Routing.Control(this._routingControlService.getControl(0));

    if (firstControl && firstControl.getWaypoints().length) {
      const firstPointLatLng = firstControl.getWaypoints()[0].latLng;
      this.addWaypoint(firstPointLatLng);
    }
  }

  public addWaypoint(latlng) {
    console.log('WaypointMarkerService.addWaypoint');

    let control = new L.Routing.Control(null);
    const isStartRouting = this._getWaypointNum() === 0;
    const shouldAddNewSegment = this._waypointIndex === this._maxAllowedValhallaWayPoints;

    if (isStartRouting) {

      // RouteService.newPlan();

      control = this._routingControlService.addNew();
      this._routeSegmentIndex = 1;
      this._waypointIndex = 0;
    } else if (shouldAddNewSegment) {
      const previousControl = this._routingControlService.getActualControl();
      const waypoints = previousControl.getWaypoints();
      const lastWaypoint = waypoints[waypoints.length - 1];
      control = this._routingControlService.addNew();
      control.spliceWaypoints(0, 1, lastWaypoint);
      this._waypointIndex = 1;
      this._routeSegmentIndex++;
    } else {
      control = this._routingControlService.getActualControl();
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
