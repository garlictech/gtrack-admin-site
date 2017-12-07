import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store/src/models';
import { storeFreeze } from 'ngrx-store-freeze';

// Subrepos
import {
  IAuthenticationState,
  Reducer as authReducer
} from 'subrepos/gtrack-common-ngx/subrepos/authentication-api-ngx';
import {
  Reducer as deepstreamReducer,
  IDeepstreamState
} from 'subrepos/gtrack-common-ngx/subrepos/deepstream-ngx';

// Actions
import * as adminMapActions from './actions/admin-map';
export type AdminMapAction = adminMapActions.AllAdminMapActions;
export { adminMapActions };

import * as hikeEditPoiActions from './actions/hike-edit-poi';
export type HikeEditPoiAction = hikeEditPoiActions.AllHikeEditPoiActions;
export { hikeEditPoiActions };

import * as hikeEditroutePlanningActions from './actions/hike-edit-route-planning';
export type HikeEditroutePlanningAction = hikeEditroutePlanningActions.AllHikeEditroutePlanningActions;
export { hikeEditroutePlanningActions };

import * as layoutActions from './actions/layout';
export type LayoutAction = layoutActions.AllLayoutActions;
export { layoutActions };

import * as routeInfoDataActions from './actions/route-info-data';
export type RouteInfoDataAction = routeInfoDataActions.AllRouteInfoDataActions;
export { routeInfoDataActions };

import * as routingActions from './actions/routing';
export type RoutingAction = routingActions.AllRoutingAction;
export { routingActions };

// Effects
export {
  AuthEffects,
  HikeEditRoutePlanningEffects,
  HikeEditPoiEffects
} from './effects';
export { RouterEffects } from 'subrepos/gtrack-common-ngx';

// States
import {
  IRouteInfoDataState,
  ILayoutState,
  IHikeEditMapState,
  IHikeEditPoiState
} from './state';
export {
  IRouteInfoDataState,
  ILayoutState,
  IHikeEditMapState,
  IHikeEditPoiState
}

// Selectors
export * from './selectors';

// Reducers
import {
  routeInfoDataReducer,
  layoutReducer,
  hikeEditMapReducer,
  hikeEditPoiReducer
} from './reducer';
export {
  routeInfoDataReducer,
  layoutReducer,
  hikeEditMapReducer,
  hikeEditPoiReducer
};

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  routeInfoData: IRouteInfoDataState;
  layout: ILayoutState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
  router: RouterReducerState; // ngrx/router
  deepstream: IDeepstreamState;
}

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  authentication: authReducer,
  routeInfoData: routeInfoDataReducer,
  layout: layoutReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditMap: hikeEditMapReducer,
  router: routerReducer,
  deepstream: deepstreamReducer
};

function logger(reducer: ActionReducer<State>): any {
  return storeLogger()(reducer);
}
const metaReducers: MetaReducer<State>[] = [logger];

if (ENV === 'development') {
  metaReducers.push(storeFreeze);
}

export const store = StoreModule.forRoot(reducers, { metaReducers });
