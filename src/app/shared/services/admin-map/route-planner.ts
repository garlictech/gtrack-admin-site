/* OLD: TrackPlanner */

import { AdminMap } from './admin-map';
import { RouteInfoData } from './route-info-data';
import {
  ISegment,
  GameRuleService,
  RouteService
} from '../../../../subrepos/gtrack-common-ngx/app';

export class RoutePlanner {
  public routeInfoData: RouteInfoData;
  private _geoJSON: GeoJSON.FeatureCollection<any>;

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService
  ) {
    this.routeInfoData = new RouteInfoData(this._routeService);
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
  }

  public addRouteSegment(coordinates, summary, updown) {
    let segment: ISegment = {
      distance: summary.totalDistance * 1000, // in meters
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates: coordinates
    }

    // Now, things according to the game rules
    segment.time = this._gameRuleService.segmentTime(segment.distance, segment.uphill),
    segment.score = this._gameRuleService.score(segment.distance, segment.uphill)

    this.routeInfoData.pushSegment(segment);
    this._createGeoJSON();
  }

  private _createGeoJSON() {
    this._resetGeoJSON();

    for (let i = 0; i < this.routeInfoData.segments.length; i++) {
      const segment = this.routeInfoData.segments[i];

      this._geoJSON.features[0].geometry.coordinates.push([
        segment.coordinates[1],
        segment.coordinates[0],
        segment.coordinates[2],
      ]);

      this._addRoutePoint(segment.coordinates[0], i + 1);
    }

    // Add the last route point: the last point of the last segment
    if (this.routeInfoData.segments.length > 0) {
      this._addRoutePoint(this._getLastPointOfLastSegment(), this.routeInfoData.segments.length + 1);
    }

    this.routeInfoData.addTrack(this._geoJSON);

    return this._geoJSON;
  }

  public removeLastSegment() {
    this.routeInfoData.popSegment();
    this._createGeoJSON();
  }

  private _getFirstPoint() {
    return this.routeInfoData.segments[0].coordinates[0];
  }

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

  private _getLastPointOfLastSegment() {
    const lastSegment = this.routeInfoData.segments[this.routeInfoData.segments.length - 1];
    const coordinateNumInLastSegment = lastSegment.coordinates.length;
    return lastSegment.coordinates[coordinateNumInLastSegment - 1];
  }

  private _createPoint(segmentPoint) {
    return {
      lat: segmentPoint[0],
      lon: segmentPoint[1],
      elevation: Math.round(segmentPoint[2])
    };
  }

  private _addSummaryValues(to, from) {
    to.distance = Math.round(from.distance);
    to.downhill = Math.round(from.downhill);
    to.uphill = Math.round(from.uphill);
    to.time = Math.round(from.time);
    to.score = from.score;
  }

  private _addIcons(trackId) {
    console.log('TODO: SvgIconService');
    /*
    SvgIconService.get(trackId, "#elevationImagePrep", "#trackImagePrep").then (icons) ->
    dbObj.elevationIcon = icons.elevationIcon
    dbObj.trackIcon = icons.trackIcon
    dbObj.$save()
    */
  }

  public saveTrack(dbObj) {
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

  private _resetGeoJSON() {
    this._geoJSON.features[0].geometry.coordinates = [];
    this._geoJSON.features.splice(1, this._geoJSON.features.length - 1);
  }
}
