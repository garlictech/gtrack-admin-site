/* OLD: TrackPlanner */

import { AdminMap } from './admin-map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, RouteInfoDataActions, IRouteInfoDataState } from '../../../store';
import {
  ISegment,
  GameRuleService,
  RouteService
} from '../../../../subrepos/gtrack-common-ngx/app';
import * as _ from 'lodash';


export class RoutePlanner {
  public routeInfoData: IRouteInfoDataState;
  private _geoJSON: GeoJSON.FeatureCollection<any>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _store: Store<State>,
    private _routeInfoDataActions: RouteInfoDataActions
  ) {
    this._geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: []
          },
          properties: {
            name: 'Tour track'
          }
        }
      ]
    }

    // Reset the state when the planner has been created
    this._store.dispatch(this._routeInfoDataActions.reset());

    // Parent classes use routeInfoData
    this._store.select((state: State) => state.routeInfoData)
      .takeUntil(this._destroy$)
      .subscribe((routeInfoData: IRouteInfoDataState) => {
        this.routeInfoData = routeInfoData;
      });

    // Update totals on each segment update
    this._store.select((state: State) => state.routeInfoData.segments)
      .takeUntil(this._destroy$)
      .subscribe((segments: ISegment[]) => {
        let _total = this._calculateTotal(segments);

        // Update total for route info
        this._store.dispatch(this._routeInfoDataActions.updateTotal(_total));

        // Refresh track data
        this._createGeoJSON(segments);
      });
  }

  public destroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public addRouteSegment(coordinates, summary, updown) {
    let _segment: ISegment = {
      distance: summary.totalDistance * 1000, // in meters
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates: coordinates
    }

    // Now, things according to the game rules
    _segment.time = this._gameRuleService.segmentTime(_segment.distance, _segment.uphill),
    _segment.score = this._gameRuleService.score(_segment.distance, _segment.uphill)

    // Add segment to store
    this._store.dispatch(this._routeInfoDataActions.pushSegment(_segment));
  }

  public removeLastSegment() {
    this._store.dispatch(this._routeInfoDataActions.popSegment());
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

    let _track: any = _.cloneDeep(this._geoJSON);

    // todo: getBounds fails when segments array is empty
    if (segments.length > 0) {
      _track.bounds = this._routeService.getBounds(_track);
    }

    this._store.dispatch(this._routeInfoDataActions.addTrack(_track));
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

  /*
  private _createPoint(segmentPoint) {
    console.log('RoutePlanner._createPoint');
    return {
      lat: segmentPoint[0],
      lon: segmentPoint[1],
      elevation: Math.round(segmentPoint[2])
    };
  }

  private _addSummaryValues(to, from) {
    console.log('RoutePlanner._addSummaryValues');
    to.distance = Math.round(from.distance);
    to.downhill = Math.round(from.downhill);
    to.uphill = Math.round(from.uphill);
    to.time = Math.round(from.time);
    to.score = from.score;
  }

  private _addIcons(trackId) {
    console.log('RoutePlanner._addIcons');
    console.log('TODO: SvgIconService');
    / *
    SvgIconService.get(trackId, "#elevationImagePrep", "#trackImagePrep").then (icons) ->
    dbObj.elevationIcon = icons.elevationIcon
    dbObj.trackIcon = icons.trackIcon
    dbObj.$save()
    * /
  }

  private _getFirstPoint() {
    console.log('RoutePlanner._getFirstPoint');
    return this.routeInfoData.segments[0].coordinates[0];
  }
  */
  public saveTrack(dbObj) {
    console.log('RoutePlanner.saveTrack', dbObj);
    console.log('TODO: _saveTrack');
    /*

    dbObj.routePoints = {}

    for segment, index in @route.segments
      dbObj.routePoints[index] = _createPoint segment.coordinates[0]

    # And the last point
    routepoint = _createPoint @_getLastPointOfLastSegment()
    dbObj.routePoints[@route.segments.length] = routepoint
    _addSummaryValues dbObj, @route.total
    # Add the start point to the location database
    geo = $geofire(new $window.Firebase "#{config.fireBaseRef}/geo/hikes")
    firstPoint = @_getFirstPoint()

    trackservice = common/routeservice!!
    TrackService.create(@geoJSON).then (id) ->
      dbObj.trackId = id

      $q.all [
        geo.$set(dbObj.$id, [firstPoint[0], firstPoint[1]]),
        _addIcons id,
        dbObj.$save()
      ]
      .then ->
        $rootScope.$broadcast 'HIKE:CHANGED'

    */
  }
}
