import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { routeAdapter, routeContextStateAdapter, IRouteState, IRouteContextState } from './state';
import { EXTERNAL_ROUTE_DEPENDENCIES, IExternalRouteDependencies } from '../../externals';
import { Dictionary } from '@ngrx/entity/src/models';
import { PoiSelectors } from '../poi/selectors';
import { Route, RouteService  } from '../../services/route';
import { Poi } from '../../services/poi';
import { RouterSelectors } from '../../../router';

@Injectable()
export class RouteSelectors {
  public selectFeature: MemoizedSelector<object, IRouteState>;
  public getRouteIds: (state: object) => string[] | number[];
  public getAllRoutes: (state: object) => Route[];
  public getAllContexts: (state: object) => IRouteContextState[];

  private _selectContextEntities: (state: object) => Dictionary<IRouteContextState>;
  private _selectRouteEntities: (state: object) => Dictionary<Route>;
  private _externals: IExternalRouteDependencies;

  constructor(
    @Inject(EXTERNAL_ROUTE_DEPENDENCIES) externals,
    private _poiSelectors: PoiSelectors,
    private _routerSelectors: RouterSelectors,
    private _hikeProgramService: RouteService
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IRouteState>(this._externals.storeDomain);

    let routeSelector = createSelector(this.selectFeature, (state: IRouteState) => state.routes);
    let contextSelector = createSelector(this.selectFeature, (state: IRouteState) => state.contexts);

    const selectors = routeAdapter.getSelectors(routeSelector);
    const contextSelectors = routeContextStateAdapter.getSelectors(contextSelector);

    this.getRouteIds = selectors.selectIds;
    this.getAllRoutes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectRouteEntities = selectors.selectEntities;
    this._selectContextEntities = contextSelectors.selectEntities;
  }

  public getRoute(context: string) {
    return createSelector(this.getAllRoutes, (routes: Route[]) => (routes.find(route => (route.id === context))));
  }
}