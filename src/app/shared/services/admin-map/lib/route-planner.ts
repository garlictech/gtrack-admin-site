/* OLD: TrackPlanner */
import { AdminMap } from './admin-map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, IHikeEditRoutePlannerState, hikeEditRoutePlannerActions } from 'app/store';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { ISegment, GameRuleService, RouteService } from 'subrepos/gtrack-common-ngx/app';

import * as _ from 'lodash';

export class RoutePlanner {
  public routeInfoData: IHikeEditRoutePlannerState;
  private _geoJSON: GeoJSON.FeatureCollection<any>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _store: Store<State>
  ) {
    // Initial value
    this._geoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        },
        properties: {
          name: 'Tour track'
        }
      }]
    }

    // Parent classes use routeInfoData
    this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .takeUntil(this._destroy$)
      .subscribe((routeInfoData: IHikeEditRoutePlannerState) => {
        this.routeInfoData = routeInfoData;
      });

    // Update totals on each segment update
    this._store.select(this._hikeEditRoutePlannerSelectors.getSegments)
      .takeUntil(this._destroy$)
      .subscribe((segments: ISegment[]) => {
        let _total = this._calculateTotal(segments);

        // Update total for route info
        this._store.dispatch(new hikeEditRoutePlannerActions.UpdateTotal({
          total: _total
        }));

        // Refresh track data
        this._createGeoJSON(segments);
      });
  }

  public destroy() {
    // Clear state
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());

    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public addRouteSegment(coordinates, summary, updown) {
    let _segment: ISegment = {
      distance: summary.totalDistance, // in meters
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates: coordinates
    }

    // Now, things according to the game rules
    _segment.time = this._gameRuleService.segmentTime(_segment.distance, _segment.uphill),
    _segment.score = this._gameRuleService.score(_segment.distance, _segment.uphill)

    // Add segment to store
    this._store.dispatch(new hikeEditRoutePlannerActions.PushSegment({
      segment: _segment
    }));
  }

  public removeLastSegment() {
    this._store.dispatch(new hikeEditRoutePlannerActions.PopSegment());
  }

  /**
   * Segment subscription submethod
   */
  private _calculateTotal(segments) {
    let total = {};

    for (let segment of segments) {
      for (let key in segment) {
        if (!total[key]) {
          total[key] = 0;
        }
        total[key] += segment[key];
      }
    }

    return total;
  }

  /**
   * Create track from geoJson
   */
  private _createGeoJSON(segments) {
    this._resetGeoJSON();

    for (let i = 0; i < segments.length; i++) {
      // Add segment coords to LineString
      const _segment = segments[i];
      for (let p of _segment.coordinates) {
        this._geoJSON.features[0].geometry.coordinates.push([p[1], p[0], p[2]]);
      }
      // Add the segment start point
      this._addRoutePoint(_segment.coordinates[0], i + 1);
    }

    // Add the last route point: the last point of the last segment
    if (segments.length > 0) {
      this._addRoutePoint(this._getLastPointOfLastSegment(segments), segments.length + 1);
    }

    let _route: any = _.cloneDeep(this._geoJSON);

    // todo: getBounds fails when segments array is empty
    if (segments.length > 0) {
      _route.bounds = this._routeService.getBounds(_route);
    }

    this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute({
      route: _route
    }));
  }

  /**
   * _createGeoJSON submethod
   */
  private _resetGeoJSON() {
    // Clear LineString coordinates
    this._geoJSON.features[0].geometry.coordinates = [];

    // Remove points
    this._geoJSON.features.splice(1, this._geoJSON.features.length - 1);
  }

  /**
   * _createGeoJSON submethod
   */
  private _addRoutePoint(dataPoint, index) {
    this._geoJSON.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dataPoint[1], dataPoint[0], dataPoint[2]]
      },
      properties: {
        name: `Route point ${index}`
      }
    });
  }

  private _getLastPointOfLastSegment(segments) {
    const _lastSegment = segments[segments.length - 1];
    const _coordinateNumInLastSegment = _lastSegment.coordinates.length;
    return _lastSegment.coordinates[_coordinateNumInLastSegment - 1];
  }
}
