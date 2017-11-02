/* OLD: RouteService  */
import { AdminMap } from './admin-map';
import { RoutePlanner } from './route-planner';
import {
  GameRuleService,
  RouteService
} from '../../../../subrepos/gtrack-common-ngx/app';

export class RouteInfo {
  private _savedRoute: any;
  private _savedMapTrack: any;
  public planner: RoutePlanner;

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService
  ) {}

  private _getSavedRoute() {
    return this._savedRoute;
  }

  private _setRoute(hike: any) {
    this._getSavedTrack(hike)
  }

  public newPlan() {
    this.planner = new RoutePlanner(this._gameRuleService, this._routeService);
  }

  private saveTrack(hike: any) {
    console.log('TODO saveTrack');
    /*
    this.planner.saveTrack(hike).then(() => {
      if (this._savedMapTrack) {
        // MapService.removeTrack(this._savedMapTrack);
      }
      this._getSavedTrack(hike);
    });
    */
  }

  public deletePlan() {
    delete this.planner;
  }

  private _getSearchBounds() {
    console.log('TODO _getSearchBounds');
    /*
    buffer = Turf.buffer @getPath(), 1000, 'meters'
    bounds = d3.geo.bounds buffer

    SouthWest:
      lat: bounds[0][1]
      lon: bounds[0][0]
    NorthEast:
      lat: bounds[1][1]
      lon: bounds[1][0]
    */
  }

  private _getRoute() {
    if (this.planner) {
      return this.planner.routeInfoData;
    } else {
      return this._savedRoute;
    }
  }

  public getPath() {
    return this._getRoute().track.features[0];
  }

  private _getTrack() {
    return this._getRoute().track;
  }

  private _getSavedTrack(hike) {
    /*
    TrackService.get(hike.trackId).then((track) =>
      route = new Route()
      route.addTrack track.geojson
      route.pushSegment segment.toNext for segment in hike.routePoints
      route.setLocation hike.location
      @savedRoute = route
      MapService.addTrackObject(track).then (leafletLayers) =>
        @_savedMapTrack = leafletLayers
    })
    */
  }
}
