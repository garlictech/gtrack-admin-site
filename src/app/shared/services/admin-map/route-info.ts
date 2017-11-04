/* OLD: RouteService  */
import { AdminMap } from './admin-map';
import { RoutePlanner } from './route-planner';
import { RouteInfoData } from './route-info-data';
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

  public getTrack() {
    return this._getRoute().track;
  }

  private _getSavedTrack(hike) {
    this._routeService.get(hike.trackId).take(1).subscribe(track => {
      let route = new RouteInfoData(this._routeService);
      route.addTrack(track.geojson);

      // route.pushSegment segment.toNext for segment in hike.routePoints

      route.setLocation(hike.location);

      this._savedRoute = route;

      /*
      MapService.addTrackObject(track).then (leafletLayers) =>
        @_savedMapTrack = leafletLayers
      })
      */
    });
  }

  public newPlan() {
    this.planner = new RoutePlanner(this._gameRuleService, this._routeService);
  }

  public deletePlan() {
    delete this.planner;
  }

  public getPath() {
    // Feature[0] contains the features[0]
    return this._getRoute().track.features[0];
  }
}
