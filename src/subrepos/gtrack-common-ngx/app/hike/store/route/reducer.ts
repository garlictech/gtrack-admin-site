// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { AllRouteActions, RouteActionTypes } from './actions';
import { AllRouteContextState, routeAdapter, routeContextStateAdapter, RouteEntityState, RouteState } from './state';

export const routeReducerInitialState = routeAdapter.getInitialState();
export const routeContextReducerInitialState = routeContextStateAdapter.getInitialState();

const contextReducer: ActionReducer<AllRouteContextState> = (
  state: AllRouteContextState = routeContextReducerInitialState,
  action: AllRouteActions
): AllRouteContextState => {
  switch (action.type) {
    case RouteActionTypes.LOAD_ROUTE:
      return routeContextStateAdapter.upsertOne(
        {
          id: action.context,
          loading: true,
          loaded: false,
          saved: false
        },
        state
      );

    case RouteActionTypes.ROUTE_LOADED:
      return routeContextStateAdapter.updateOne(
        {
          id: action.context,
          changes: {
            loading: false,
            loaded: true,
            saved: false
          }
        },
        state
      );

    case RouteActionTypes.ROUTE_SAVED:
      return routeContextStateAdapter.updateOne(
        {
          id: action.context,
          changes: {
            saved: true
          }
        },
        state
      );

    case RouteActionTypes.ROUTE_MODIFIED:
      return routeContextStateAdapter.upsertOne(
        {
          id: action.context,
          saved: false,
          loaded: true,
          loading: false
        },
        state
      );

    default:
      return state;
  }
};

const reducer: ActionReducer<RouteEntityState> = (
  state: RouteEntityState = routeReducerInitialState,
  action: AllRouteActions
): RouteEntityState => {
  switch (action.type) {
    case RouteActionTypes.ROUTE_LOADED:
      return routeAdapter.upsertOne(action.route, state);

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<RouteState> = {
  contexts: contextReducer,
  routes: reducer
};

export const routeReducer = combineReducers(reducerMap);
