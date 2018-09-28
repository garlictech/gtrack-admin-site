import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { routeAdapter, routeContextStateAdapter, IRouteState, IRouteContextState } from './state';
import { EXTERNAL_ROUTE_DEPENDENCIES, IExternalRouteDependencies } from '../../externals';
import { IRouteStored } from '../../../../../provider-client';

@Injectable()
export class RouteSelectors {
  public selectFeature: MemoizedSelector<object, IRouteState>;
  public getRouteIds: (state: object) => string[] | number[];
  public getAllRoutes: (state: object) => IRouteStored[];
  public getAllContexts: (state: object) => IRouteContextState[];

  private _externals: IExternalRouteDependencies;

  constructor(@Inject(EXTERNAL_ROUTE_DEPENDENCIES) externals) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IRouteState>(this._externals.storeDomain);

    const routeSelector = createSelector(this.selectFeature, (state: IRouteState) => state.routes);
    const contextSelector = createSelector(this.selectFeature, (state: IRouteState) => state.contexts);

    const selectors = routeAdapter.getSelectors(routeSelector);
    const contextSelectors = routeContextStateAdapter.getSelectors(contextSelector);

    this.getRouteIds = selectors.selectIds;
    this.getAllRoutes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  public getRoute(context: string) {
    return createSelector(this.getAllRoutes, (routes: IRouteStored[]) => routes.find(route => route.id === context));
  }

  public getRoutes(contexts: string[]) {
    return createSelector(this.getAllRoutes, routes =>
      routes.filter(route => {
        if (route.id) {
          return contexts.indexOf(route.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }

  public getRouteContext(id: string) {
    return createSelector(this.getAllContexts, contexts => {
      return contexts.find(context => context.id === id);
    });
  }

  public getRouteContexts(ids: string[]) {
    return createSelector(this.getAllContexts, contexts =>
      contexts.filter(context => {
        if (context.id) {
          return ids.indexOf(context.id) !== -1;
        } else {
          return false;
        }
      })
    );
  }
}
