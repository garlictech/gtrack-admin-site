import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, hikeEditRoutePlannerActions } from 'app/store';
import { GameRuleService, ISegment, RouteService } from 'subrepos/gtrack-common-ngx';
import { initialRouteDataState } from 'app/store/reducer';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';

import * as _ from 'lodash';
import * as turf from '@turf/turf';
import * as rewind from 'geojson-rewind';
import * as d3 from 'd3';
import { LineString } from '@turf/turf';

@Injectable()
export class RoutePlannerService {
  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
  ) {
    // Update totals on each segment update
    this._store
      .select(this._hikeEditRoutePlannerSelectors.getSegments)
      .subscribe((segments: ISegment[]) => {
        // Update total for route info
        this._store.dispatch(new hikeEditRoutePlannerActions.UpdateTotal(this._calculateTotal(segments)));

        // Refresh route data
        this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute(this._createGeoJSON(segments)));
      });
  }

  /**
   * Add the loaded route to the store
   * This is an initial loading method, the segment based route drawing will replace it.
   */
  public addLoadedRoute(route) {
    let _geoJSON = _.cloneDeep(route);
    _geoJSON.bounds = this._routeService.getBounds(_geoJSON);

    this._store.dispatch(new hikeEditRoutePlannerActions.AddRoute(_geoJSON));
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
    this._store.dispatch(new hikeEditRoutePlannerActions.PushSegment(_segment));
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
    let _geoJSON: any = _.cloneDeep(initialRouteDataState);

    for (let i in segments) {
      // Add segment coords to LineString
      const _segment = segments[i];
      for (let p of _segment.coordinates) {
        _geoJSON.features[0].geometry.coordinates.push([p[1], p[0], p[2]]);
      }

      // Add the segment start point
      _geoJSON.features.push(<any>(this._createRoutePoint(_segment.coordinates[0], i + 1)));
    }

    // Add the last route point: the last point of the last segment
    if (segments.length > 0) {
      _geoJSON.features.push(<any>(this._createRoutePoint(this._getLastPointOfLastSegment(segments), segments.length + 1)));
    }

    if (segments.length > 0) {
      _geoJSON.bounds = this._routeService.getBounds(_geoJSON);
    }

    return _geoJSON;
  }

  /**
   * _createGeoJSON submethod
   */
  private _createRoutePoint(dataPoint, index) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dataPoint[1], dataPoint[0], dataPoint[2]]
      },
      properties: {
        name: `Route point ${index}`
      }
    };
  }

  /**
   * _createGeoJSON submethod
   */
  private _getLastPointOfLastSegment(segments) {
    const _lastSegment = segments[segments.length - 1];
    const _coordinateNumInLastSegment = _lastSegment.coordinates.length;

    return _lastSegment.coordinates[_coordinateNumInLastSegment - 1];
  }

  /**
   * Get path bounds for POI search
   */
  public getSearchBounds() {
    let _path;

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .take(1)
      .subscribe((path) => {
        // declare as 'any' for avoid d3.geoBounds error
        let _buffer: any = turf.buffer(path, 1000, {units: 'meters'});

        if (typeof _buffer !== 'undefined') {
          let _bounds = d3.geoBounds(rewind(_buffer, true));

          _path = {
            NorthEast: {
              lat: _bounds[1][1],
              lon: _bounds[1][0]
            },
            SouthWest: {
              lat: _bounds[0][1],
              lon: _bounds[0][0]
            }
          };
        } else {
          _path = null;
        }
      });

    return _path;
  }
}
