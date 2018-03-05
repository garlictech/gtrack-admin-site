/* OLD: RouteService  */
import { Store } from '@ngrx/store';
import { State, IHikeEditRoutePlannerState } from 'app/store';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { AdminMap } from './admin-map';
import { RoutePlanner } from './route-planner';
import { GameRuleService, RouteService } from 'subrepos/gtrack-common-ngx/app';
import { Feature } from 'geojson';
import { Polygon } from 'leaflet';
import { ExtendedFeature, ExtendedGeometryCollection } from 'd3';

import * as turf from '@turf/turf';
import * as rewind from 'geojson-rewind';
import * as d3 from 'd3';

export class RouteInfo {
  private _savedRoute: IHikeEditRoutePlannerState; // Deprecated?
  private _savedMapTrack: any;
  public planner: RoutePlanner;

  constructor(
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _store: Store<State>
  ) {}

  public newPlan() {
    this.planner = new RoutePlanner(
      this._gameRuleService,
      this._routeService,
      this._hikeEditRoutePlannerSelectors,
      this._store
    );
  }

  public deletePlan() {
    // Cleanup subscriptions
    this.planner.destroy();
    delete this.planner;
  }

  /**
   * Get route from current plan
   */
  public getRoute() {
    return this._getRoute().route;
  }

  /**
   * Get track path from current route
   */
  public getPath() {
    // Feature[0] contains the route polyLine
    const route = this._getRoute();

    if (route && route.route) {
      return this._getRoute().route.features[0];
    } else {
      return null;
    }
  }

  private _getRoute() {
    if (this.planner) {
      return this.planner.routeInfoData;
    } else {
      console.log('TODO is in use??');
      return this._savedRoute;
    }
  }

  /**
   * Get path bounds for POI search
   */
  public getSearchBounds() {
    let _path = this.getPath();

    if (typeof _path !== 'undefined') {
      // declare as 'any' for avoid d3.geoBounds error
      let _buffer: any = turf.buffer(_path, 1000, {units: 'meters'});

      if (typeof _buffer !== 'undefined') {
        let _bounds = d3.geoBounds(rewind(_buffer, true));

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
}
