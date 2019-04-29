import { Injectable } from '@angular/core';
import { RouteStored } from '@features/common/gtrack-interfaces';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { featureName, routeAdapter, RouteContextState, routeContextStateAdapter, RouteState } from './state';

@Injectable()
export class RouteSelectors {
  selectFeature: MemoizedSelector<object, RouteState>;
  getRouteIds: (state: object) => Array<string> | Array<number>;
  getAllRoutes: (state: object) => Array<RouteStored>;
  getAllContexts: (state: object) => Array<RouteContextState>;

  constructor() {
    this.selectFeature = createFeatureSelector<RouteState>(featureName);

    const routeSelector = createSelector(
      this.selectFeature,
      (state: RouteState) => state.routes
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: RouteState) => state.contexts
    );

    const selectors = routeAdapter.getSelectors(routeSelector);
    const contextSelectors = routeContextStateAdapter.getSelectors(contextSelector);

    this.getRouteIds = selectors.selectIds;
    this.getAllRoutes = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  getRoute(context: string): MemoizedSelector<object, RouteStored> {
    return createSelector(
      this.getAllRoutes,
      (routes: Array<RouteStored>) => routes.find(route => route.id === context)
    );
  }

  getRoutes(contexts: Array<string>): MemoizedSelector<object, Array<RouteStored>> {
    return createSelector(
      this.getAllRoutes,
      routes =>
        routes.filter(route => {
          if (route.id) {
            return contexts.indexOf(route.id) !== -1;
          } else {
            return false;
          }
        })
    );
  }

  getRouteContext(id: string): MemoizedSelector<object, any> {
    return createSelector(
      this.getAllContexts,
      contexts => contexts.find(context => context.id === id)
    );
  }

  getRouteContexts(ids: Array<string>): MemoizedSelector<object, Array<any>> {
    return createSelector(
      this.getAllContexts,
      contexts =>
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
