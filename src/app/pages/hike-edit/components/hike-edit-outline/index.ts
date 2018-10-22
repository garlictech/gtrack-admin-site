import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, delay } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store';
import { EditedHikeProgramSelectors, HikeEditRoutePlannerSelectors } from '../../../../store/selectors';
import { IHikeProgramStop } from 'subrepos/provider-client';
import { PoiSelectors, IconService, ISegment } from 'subrepos/gtrack-common-ngx';

import * as L from 'leaflet';
import _first from 'lodash-es/first';
import _last from 'lodash-es/last';
import { point as turfPoint, lineString as turfLineString } from '@turf/helpers';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';
import { WaypointMarkerService, RoutePlannerService } from 'app/shared/services';
import { IRoutePlanResult } from 'app/shared/services/admin-map/waypoint-marker.service';

interface INearestSegmentData {
  nearestIdx: number;
  segments: ISegment[]
}

@Component({
  selector: 'app-hike-edit-outline',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditOutlineComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isPlanning$: Observable<boolean>;
  public stops$: Observable<IHikeProgramStop[]>;
  public startIcon: string;
  public finishIcon: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
    private _poiSelectors: PoiSelectors,
    private _iconService: IconService
  ) {
    this.startIcon = this._iconService.url('start');
    this.finishIcon = this._iconService.url('finish');
  }

  ngOnInit() {
    this.stops$ = this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getStopsWithPoiNames(this._poiSelectors.getAllPois)),
        delay(0),
        takeUntil(this._destroy$)
      );
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public startHere(event, stop: IHikeProgramStop) {
    event.preventDefault();

    this.getNearestSegmentToPoint(stop)
      .then((sData: INearestSegmentData) => {
        // Plan new route between the snapped point and the segment endpoint
        this._waypointMarkerService.getRouteFromApi(
          L.latLng(stop.lat, stop.lon),
          L.latLng(_last(sData.segments[sData.nearestIdx].coordinates)[0], _last(sData.segments[sData.nearestIdx].coordinates)[1])
        ).then((data: IRoutePlanResult) => {
          this._waypointMarkerService.removeSegments(0, sData.nearestIdx);
          this._waypointMarkerService.insertNewStartPoint(L.latLng(stop.lat, stop.lon));
          this._routePlannerService.updateRouteSegment(0, data.coordsArr, data.upDown);
        });
      });
  }

  public endHere(event, stop: IHikeProgramStop) {
    event.preventDefault();

    this.getNearestSegmentToPoint(stop)
      .then((sData: INearestSegmentData) => {
        // Plan new route between the snapped point and the segment endpoint
        this._waypointMarkerService.getRouteFromApi(
          L.latLng(_first(sData.segments[sData.nearestIdx].coordinates)[0], _first(sData.segments[sData.nearestIdx].coordinates)[1]),
          L.latLng(stop.lat, stop.lon)
        ).then((data: IRoutePlanResult) => {
          this._waypointMarkerService.removeSegments(sData.nearestIdx, sData.segments.length - sData.nearestIdx + 1);
          this._waypointMarkerService.insertNewEndPoint(L.latLng(stop.lat, stop.lon));
          this._routePlannerService.updateRouteSegment(sData.nearestIdx, data.coordsArr, data.upDown);
        });
      });
  }

  private getNearestSegmentToPoint(stop: IHikeProgramStop) {
    return new Promise((resolve) => {
      this._store
        .pipe(
          select(this._hikeEditRoutePlannerSelectors.getSegments),
          take(1)
        )
        .subscribe((segments: ISegment[]) => {
          const stopPoint = turfPoint([stop.lat, stop.lon]);
          const snappedPoints = [];

          // Snap the point to all segments
          for (let idx in segments) {
            const segmentLine = turfLineString(segments[idx].coordinates);
            const snappedPointToSegment = turfNearestPointOnLine(segmentLine, stopPoint);
            snappedPoints.push(snappedPointToSegment);
          }

          // Find the nearest segment
          const distances = snappedPoints.map(p => p.properties.dist);
          const nearestIdx = distances.indexOf(Math.min(...distances));

          resolve({
            nearestIdx: nearestIdx,
            segments: segments
          })
        });
    });
  }
}
/*
rivate _moveLastWaypointToRoute(coords) {
    for (let i = this._markers.length - 2; i < this._markers.length; i++) {
      const line = turfLineString(coords);
      const pt = turfPoint([this._markers[i].getLatLng().lat, this._markers[i].getLatLng().lng]);
      const snapped = turfNearestPointOnLine(line, pt);

      this._markers[i].setLatLng(new L.LatLng(
        (<any>snapped.geometry).coordinates[0],
        (<any>snapped.geometry).coordinates[1]
      ));
    }
  }
*/