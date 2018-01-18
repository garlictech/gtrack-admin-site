import { storeLogger } from 'ngrx-store-logger';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store/src/models';
import { storeFreeze } from 'ngrx-store-freeze';

// Subrepos
import {
  IAuthenticationState,
  Reducer as authReducer
} from 'subrepos/authentication-api-ngx';
import { Reducer as deepstreamReducer, IDeepstreamState } from 'subrepos/deepstream-ngx';

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

import * as hikeListActions from './actions/hike-list';
export type HikeListAction = hikeListActions.AllHikeListActions;
export { hikeListActions };

import * as routeInfoDataActions from './actions/route-info-data';
export type RouteInfoDataAction = routeInfoDataActions.AllRouteInfoDataActions;
export { routeInfoDataActions };

import * as routingActions from './actions/routing';
export type RoutingAction = routingActions.AllRoutingAction;
export { routingActions };

// Effects
export { AuthEffects, HikeEditRoutePlanningEffects, HikeEditPoiEffects } from './effects';
export { RouterEffects } from 'subrepos/gtrack-common-ngx';

// States
import {
  IRouteInfoDataState, IHikeEditMapState, IHikeEditPoiState, IExternalPoiListContextState
} from './state';
export {
  IRouteInfoDataState, IHikeEditMapState, IHikeEditPoiState, IExternalPoiListContextState
};

// Selectors
export * from './selectors';

// Reducers
import { routeInfoDataReducer, hikeEditMapReducer, hikeEditPoiReducer } from './reducer';
export { routeInfoDataReducer, hikeEditMapReducer, hikeEditPoiReducer };

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  routeInfoData: IRouteInfoDataState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
  router: RouterReducerState; // ngrx/router
  deepstream: IDeepstreamState;
}

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  authentication: authReducer,
  routeInfoData: routeInfoDataReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditMap: hikeEditMapReducer,
  router: routerReducer,
  deepstream: deepstreamReducer
};

function logger(reducer: ActionReducer<State>): any {
  return storeLogger()(reducer);
}
const metaReducers: MetaReducer<State>[] = [logger];

if (ENV === 'development') {
  metaReducers.push(storeFreeze);
}

export const store = StoreModule.forRoot(reducers, { metaReducers });
