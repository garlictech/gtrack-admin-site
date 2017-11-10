/* OLD: RouteService  */
import { Store } from '@ngrx/store';
import { State, RouteInfoDataActions } from '../../../store';
import { AdminMap } from './admin-map';
import { RoutePlanner } from './route-planner';
import { RouteInfoData } from './route-info-data';
import {
  GameRuleService,
  RouteService
} from '../../../../subrepos/gtrack-common-ngx/app';

export class RouteInfo {
  private _savedRoute: RouteInfoData;
  private _savedMapTrack: any;
  public planner: RoutePlanner;

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _store: Store<State>,
    private _routeInfoDataActions: RouteInfoDataActions
  ) {}

  public newPlan() {
    console.log('RouteInfo.newPlan');
    this.planner = new RoutePlanner(
      this._gameRuleService,
      this._routeService,
      this._store,
      this._routeInfoDataActions
    );
  }

  public deletePlan() {
    console.log('RouteInfo.deletePlan');
    delete this.planner;
  }

  public getTrack() {
    console.log('RouteInfo.getTrack');
    return this._getRoute().track;
  }

  public getPath() {
    console.log('RouteInfo.getPath');
    // Feature[0] contains the route polyLine
    const route = this._getRoute();
    if (route && route.track) {
      return this._getRoute().track.features[0];
    } else {
      return null;
    }
  }

  private _getRoute() {
    console.log('RouteInfo._getRoute');
    if (this.planner) {
      return this.planner.routeInfoData;
    } else {
      return this._savedRoute;
    }
  }

  private saveTrack(hike: any) {
    console.log('RouteInfo.saveTrack');
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

  /*
  private _getSavedRoute() {
    console.log('RouteInfo._getSavedRoute');
    return this._savedRoute;
  }

  private _setRoute(hike: any) {
    console.log('RouteInfo._setRoute');
    this._getSavedTrack(hike)
  }
  */

  /*
  private _getSearchBounds() {
    console.log('RouteInfo._getSearchBounds');
    console.log('TODO _getSearchBounds');

    buffer = Turf.buffer @getPath(), 1000, 'meters'
    bounds = d3.geo.bounds buffer

    SouthWest:
      lat: bounds[0][1]
      lon: bounds[0][0]
    NorthEast:
      lat: bounds[1][1]
      lon: bounds[1][0]

  }*/

  /*
  private _getSavedTrack(hike) {
    console.log('RouteInfo._getSavedTrack', hike);
    this._routeService.get(hike.trackId).take(1).subscribe(track => {
      let _routeInfoData = new RouteInfoData(this._routeService);
      _routeInfoData.addTrack(track.geojson);

      // route.pushSegment segment.toNext for segment in hike.routePoints

      _routeInfoData.setLocation(hike.location);

      this._savedRoute = _routeInfoData;

      MapService.addTrackObject(track).then (leafletLayers) =>
        @_savedMapTrack = leafletLayers
      })

    });

  } */
}
