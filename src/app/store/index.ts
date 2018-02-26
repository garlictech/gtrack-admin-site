import { storeLogger } from 'ngrx-store-logger';
import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store/src/models';
import { storeFreeze } from 'ngrx-store-freeze';

import { IAuthenticationState, Reducer as authReducer } from 'subrepos/authentication-api-ngx';
import { Reducer as deepstreamReducer, IDeepstreamState } from 'subrepos/deepstream-ngx';
import { CommonState, commonReducers } from 'subrepos/gtrack-common-ngx';

/////////////
// Actions
/////////////

import * as adminMapActions from './actions/admin-map';
export type AdminMapAction = adminMapActions.AllAdminMapActions;
export { adminMapActions };

import * as hikeEditActions from './actions/hike-edit';
export type HikeEditAction = hikeEditActions.AllHikeEditActions;
export { hikeEditActions };

import * as hikeEditGeneralInfoActions from './actions/hike-edit-general-info';
export type HikeEditGeneralInfoAction = hikeEditGeneralInfoActions.AllHikeEditGeneralInfoActions;
export { hikeEditGeneralInfoActions };

import * as hikeEditMapActions from './actions/hike-edit-map';
export type HikeEditMapAction = hikeEditMapActions.AllHikeEditMapActions;
export { hikeEditMapActions };

import * as hikeEditPoiActions from './actions/hike-edit-poi';
export type HikeEditPoiAction = hikeEditPoiActions.AllHikeEditPoiActions;
export { hikeEditPoiActions };

import * as hikeEditRoutePlannerActions from './actions/hike-edit-route-planner';
export type HikeEditRoutePlannerAction = hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions;
export { hikeEditRoutePlannerActions };

import * as hikeListActions from './actions/hike-list';
export type HikeListAction = hikeListActions.AllHikeListActions;
export { hikeListActions };

import * as routingActions from './actions/routing';
export type RoutingAction = routingActions.AllRoutingAction;
export { routingActions };

import * as commonPoiActions from 'subrepos/gtrack-common-ngx/app/hike/store/poi/actions';
export type CommonPoiAction = commonPoiActions.AllPoiActions;
export { commonPoiActions };

import * as commonHikeActions from 'subrepos/gtrack-common-ngx/app/hike/store/hike/actions';
export type CommonHikeAction = commonHikeActions.AllHikeActions;
export { commonHikeActions };

import * as commonRouteActions from 'subrepos/gtrack-common-ngx/app/hike/store/route/actions';
export type CommonRouteAction = commonRouteActions.AllRouteActions;
export { commonRouteActions };

import * as commonGeoSearchActions from 'subrepos/gtrack-common-ngx/app/geosearch/store/actions';
export type CommonGeoSearchAction = commonGeoSearchActions.AllGeoSearchActions;
export { commonGeoSearchActions };

/////////////
// Effects
/////////////

export {
  AuthEffects, HikeEditEffects, HikeEditRoutePlannerEffects, HikeEditPoiEffects
} from './effects';
export { RouterEffects, PoiEffects } from 'subrepos/gtrack-common-ngx';

////////////
// States
////////////

import {
  IHikeEditRoutePlannerState, IHikeEditMapState, IHikeEditMapMapState, IHikeEditPoiState, IExternalPoiListContextState, IHikeEditGeneralInfoState, IExternalPoiListContextItemState
} from './state';
export {
  IHikeEditRoutePlannerState, IHikeEditMapState, IHikeEditMapMapState, IHikeEditPoiState, IExternalPoiListContextState, IHikeEditGeneralInfoState, IExternalPoiListContextItemState
};

//////////////
// Reducers
//////////////

import { hikeEditRoutePlannerReducer, hikeEditMapReducer, hikeEditPoiReducer } from './reducer';
import { hikeEditGeneralInfoReducer } from './reducer/hike-edig-general-info';
import { environment } from 'environments/environment';
export { hikeEditRoutePlannerReducer, hikeEditMapReducer, hikeEditPoiReducer };

//////////////
// State
//////////////

// Extend the store interface with that.
export interface State extends CommonState {
  authentication: IAuthenticationState;
  router: RouterReducerState; // ngrx/router
  deepstream: IDeepstreamState;
  hikeEditRoutePlanner: IHikeEditRoutePlannerState;
  hikeEditGeneralInfo: IHikeEditGeneralInfoState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
}

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  ...commonReducers,
  authentication: authReducer,
  router: routerReducer,
  deepstream: deepstreamReducer,
  hikeEditRoutePlanner: hikeEditRoutePlannerReducer,
  hikeEditGeneralInfo: hikeEditGeneralInfoReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditMap: hikeEditMapReducer
};

function logger(reducer: ActionReducer<State>): any {
  return storeLogger()(reducer);
}
const metaReducers: MetaReducer<State>[] = [];

if (!environment.production) {
  metaReducers.push(logger);
  metaReducers.push(storeFreeze);
}

export const store = StoreModule.forRoot(reducers, { metaReducers });
