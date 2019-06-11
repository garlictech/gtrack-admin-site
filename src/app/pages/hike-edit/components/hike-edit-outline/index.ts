import { RoutePlannerService, WaypointMarkerService } from 'app/shared/services';
import { RoutePlanResult } from 'app/shared/services/admin-map/waypoint-marker.service';
import * as L from 'leaflet';
import _first from 'lodash-es/first';
import _last from 'lodash-es/last';
import { Observable, Subject } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { HikeProgramStop, Segment } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';
import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import { select, Store } from '@ngrx/store';
import { lineString as turfLineString, point as turfPoint } from '@turf/helpers';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';

import { State } from '../../../../store';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

interface NearestSegmentData {
  nearestIdx: number;
  segments: Array<Segment>;
}

@Component({
  selector: 'app-hike-edit-outline',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditOutlineComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isPlanning$: Observable<boolean>;
  stops$: Observable<Array<HikeProgramStop>>;
  startIcon: SafeResourceUrl;
  finishIcon: SafeResourceUrl;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _waypointMarkerService: WaypointMarkerService,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _markerIconsService: MarkerIconsService
  ) {
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.startIcon = this._markerIconsService.getIcon('start', true);
    this.finishIcon = this._markerIconsService.getIcon('finish', true);

    this.stops$ = this._store.pipe(
      select(editedHikeProgramSelectors.getStopsWithPoiNames(this._poiSelectors.getAllPois)),
      delay(0),
      takeUntil(this._destroy$)
    );
  }

  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  startHere(event, stop: HikeProgramStop): void {
    event.preventDefault();

    this._getNearestSegmentToPoint(stop).then(
      (sData: NearestSegmentData) => {
        // Plan new route between the snapped point and the segment endpoint
        this._waypointMarkerService
          .getRouteFromApi(
            L.latLng(stop.lat, stop.lon),
            L.latLng(
              _last(sData.segments[sData.nearestIdx].coordinates)[1],
              _last(sData.segments[sData.nearestIdx].coordinates)[0]
            )
          )
          .then(
            (data: RoutePlanResult) => {
              this._waypointMarkerService.removeSegments(0, sData.nearestIdx);
              this._waypointMarkerService.insertNewStartPoint(L.latLng(stop.lat, stop.lon));
              this._routePlannerService.updateRouteSegment(0, data.coordsArr, data.upDown);
            },
            () => {
              /**/
            }
          );
      },
      () => {
        /**/
      }
    );
  }

  endHere(event, stop: HikeProgramStop): void {
    event.preventDefault();

    this._getNearestSegmentToPoint(stop).then(
      (sData: NearestSegmentData) => {
        // Plan new route between the snapped point and the segment endpoint
        this._waypointMarkerService
          .getRouteFromApi(
            L.latLng(
              _first(sData.segments[sData.nearestIdx].coordinates)[1],
              _first(sData.segments[sData.nearestIdx].coordinates)[0]
            ),
            L.latLng(stop.lat, stop.lon)
          )
          .then(
            (data: RoutePlanResult) => {
              this._waypointMarkerService.removeSegments(
                sData.nearestIdx,
                sData.segments.length - sData.nearestIdx + 1
              );
              this._waypointMarkerService.insertNewEndPoint(L.latLng(stop.lat, stop.lon));
              this._routePlannerService.updateRouteSegment(sData.nearestIdx, data.coordsArr, data.upDown);
            },
            () => {
              /**/
            }
          );
      },
      () => {
        /**/
      }
    );
  }

  private async _getNearestSegmentToPoint(stop: HikeProgramStop): Promise<any> {
    return new Promise(resolve => {
      this._store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getSegments),
          take(1)
        )
        .subscribe((segments: Array<Segment>) => {
          const stopPoint = turfPoint([stop.lat, stop.lon]);
          const snappedPoints = [];

          // Snap the point to all segments
          for (const segment of segments) {
            const segmentLine = turfLineString(segment.coordinates);
            const snappedPointToSegment = turfNearestPointOnLine(segmentLine, stopPoint);
            snappedPoints.push(snappedPointToSegment);
          }

          // Find the nearest segment
          const distances = snappedPoints.map(p => p.properties.dist);
          const nearestIdx = distances.indexOf(Math.min(...distances));

          resolve({
            nearestIdx,
            segments
          });
        });
    });
  }
}
