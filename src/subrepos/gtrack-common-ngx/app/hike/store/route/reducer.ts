import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as _ from 'lodash';

import {
  IAllRouteContextState,
  routeContextStateAdapter,
  IRouteEntityState,
  IRouteState,
  routeAdapter
} from './state';

import {
  RouteActionTypes,
  AllRouteActions
} from './actions';

export const routeReducerInitialState = routeAdapter.getInitialState();
export const routeContextReducerInitialState = routeContextStateAdapter.getInitialState();

const contextReducer: ActionReducer<IAllRouteContextState> = (
  state: IAllRouteContextState = routeContextReducerInitialState,
  action: AllRouteActions
): IAllRouteContextState => {
  switch (action.type) {
    case RouteActionTypes.LOAD_ROUTE:
      return routeContextStateAdapter.addOne({
        id: action.context,
        loading: true,
        loaded: false,
        saved: false
      }, state);

    case RouteActionTypes.ROUTE_LOADED:
      return routeContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          loading: false,
          loaded: true,
          saved: false
        }
      }, state);

    case RouteActionTypes.ROUTE_SAVED:
      return routeContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          saved: true
        }
      }, state);

    default:
      return state;
  }
};

const reducer: ActionReducer<IRouteEntityState> = (
  state: IRouteEntityState = routeReducerInitialState,
  action: AllRouteActions
): IRouteEntityState => {
  switch (action.type) {
    case RouteActionTypes.ROUTE_LOADED:
      return routeAdapter.addOne(action.route, state);

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IRouteState> = {
  contexts: contextReducer,
  routes: reducer
};

export const routeReducer = combineReducers(reducerMap);
