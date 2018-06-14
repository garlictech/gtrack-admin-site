import { storeLogger } from 'ngrx-store-logger';
import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store/src/models';
import { storeFreeze } from 'ngrx-store-freeze';

import { commonReducers } from 'subrepos/gtrack-common-ngx';
import { Reducer as LanguageReducer } from 'app/language';

/////////////
// Actions
/////////////

import * as adminMapActions from './actions/admin-map';
export type AdminMapAction = adminMapActions.AllAdminMapActions;
export { adminMapActions };

import * as editedGTrackPoiActions from './actions/edited-gtrack-poi';
export type EditedGTrackPoiAction = editedGTrackPoiActions.AllEditedGTrackPoiActions;
export { editedGTrackPoiActions };

import * as editedHikeProgramActions from './actions/edited-hike-program';
export type EditedHikeProgramAction = editedHikeProgramActions.AllEditedHikeProgramActions;
export { editedHikeProgramActions };

import * as hikeEditActions from './actions/hike-edit';
export type HikeEditAction = hikeEditActions.AllHikeEditActions;
export { hikeEditActions };

import * as hikeEditMapActions from './actions/hike-edit-map';
export type HikeEditMapAction = hikeEditMapActions.AllHikeEditMapActions;
export { hikeEditMapActions };

import * as hikeEditPoiActions from './actions/hike-edit-poi';
export type HikeEditPoiAction = hikeEditPoiActions.AllHikeEditPoiActions;
export { hikeEditPoiActions };

import * as hikeEditImageActions from './actions/hike-edit-image';
export type HikeEditImageAction = hikeEditImageActions.AllHikeEditImageActions;
export { hikeEditImageActions };

import * as hikeEditRoutePlannerActions from './actions/hike-edit-route-planner';
export type HikeEditRoutePlannerAction = hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions;
export { hikeEditRoutePlannerActions };

import * as hikeListActions from './actions/hike-list';
export type HikeListAction = hikeListActions.AllHikeListActions;
export { hikeListActions };

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

import * as commonBackgroundGeolocationActions from 'subrepos/gtrack-common-ngx/app/shared/services/background-geolocation-service/store/actions';
export { commonBackgroundGeolocationActions };

//////////////
// Reducers
//////////////

import { hikeEditRoutePlannerReducer } from './reducer/hike-edit-route-planner';
import { hikeEditPoiReducer } from './reducer/hike-edit-poi';
import { hikeEditImageReducer } from './reducer/hike-edit-image';
import { hikeEditMapReducer } from './reducer/hike-edit-map';
import { editedHikeProgramReducer } from './reducer/edited-hike-program';
import { editedGTrackPoiReducer } from './reducer/edited-gtrack-poi';

//////////////
// State
//////////////

import { State } from './state';
import { LOGOUT_SUCCESS } from 'subrepos/authentication-api-ngx/store/actions';
import { InjectionToken } from '@angular/core';

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  ...commonReducers,
  router: routerReducer,
  hikeEditRoutePlanner: hikeEditRoutePlannerReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditImage: hikeEditImageReducer,
  hikeEditMap: hikeEditMapReducer,
  language: LanguageReducer,
  editedHikeProgram: editedHikeProgramReducer,
  editedGtrackPoi: editedGTrackPoiReducer
};

// Clear the store at logout
export function logout(_reducer) {
  return function(state, action) {
    return _reducer(action.type === LOGOUT_SUCCESS ? undefined : state, action);
  };
}

export function logger(_reducer: ActionReducer<State>): any {
  return storeLogger()(_reducer);
}

let metaReducers = [logger, logout];

if (process.env.ENV !== 'production') {
  metaReducers.push(storeFreeze);
}

export { metaReducers };

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<State>>('Registered Reducers');

export function getReducers() {
  return reducers;
}

export * from './state';
