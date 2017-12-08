/* OLD: RouteService  */
import { Store } from '@ngrx/store';
import { State, IRouteInfoDataState } from 'app/store';
import { AdminMap } from './admin-map';
import { RoutePlanner } from './route-planner';
import {
  GameRuleService,
  RouteService
} from 'subrepos/gtrack-common-ngx/app';
import * as turf from '@turf/turf';
import * as d3 from 'd3';
import { Feature } from 'geojson';
import { Polygon } from 'leaflet';
import { ExtendedFeature, ExtendedGeometryCollection } from 'd3';

export class RouteInfo {
  private _savedRoute: IRouteInfoDataState; // Deprecated?
  private _savedMapTrack: any;
  public planner: RoutePlanner;

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _store: Store<State>
  ) {}

  public newPlan() {
    this.planner = new RoutePlanner(
      this._gameRuleService,
      this._routeService,
      this._store
    );
  }

  public deletePlan() {
    // Cleanup subscriptions
    this.planner.destroy();
    delete this.planner;
  }

  /**
   * Get track from current route
   */
  public getTrack() {
    return this._getRoute().track;
  }

  /**
   * Get track path from current route
   */
  public getPath() {
    // Feature[0] contains the route polyLine
    const route = this._getRoute();

    if (route && route.track) {
      return this._getRoute().track.features[0];
    } else {
      return null;
    }
  }

  private _getRoute() {
    // TODO use only the store?
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

  /**
   * Get path bounds for POI search
   */
  public getSearchBounds() {
    let _path = this.getPath();

    if (typeof _path !== 'undefined') {
      // todo back to 1000 meters
      // declare as 'any' for avoid d3.geoBounds error
      let _buffer: any = turf.buffer(_path, 50, {units: 'meters'});

      if (typeof _buffer !== 'undefined') {
        _buffer = turf.rewind(_buffer, true);
        let _bounds = d3.geoBounds(_buffer);

        return {
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
        return;
      }
    } else {
      return;
    }
  }

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
