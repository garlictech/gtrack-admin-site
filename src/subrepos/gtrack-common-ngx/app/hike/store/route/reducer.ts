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

const contextReducer: ActionReducer<IAllRouteContextState> = (
  state: IAllRouteContextState = routeContextStateAdapter.getInitialState(),
  action: AllRouteActions
): IAllRouteContextState => {
  switch (action.type) {
    case RouteActionTypes.LOAD_ROUTE:
      return routeContextStateAdapter.addOne({
        id: action.context,
        loading: true,
        loaded: false
      }, state);

    case RouteActionTypes.ROUTE_LOADED:
      return routeContextStateAdapter.updateOne({
        id: action.context,
        changes: {
          loading: false,
          loaded: true
        }
      }, state);

    default:
      return state;
  }
};

const reducer: ActionReducer<IRouteEntityState> = (
  state: IRouteEntityState = routeAdapter.getInitialState(),
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
