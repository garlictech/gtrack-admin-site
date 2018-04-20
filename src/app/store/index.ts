import { storeLogger } from 'ngrx-store-logger';
import { StoreModule } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store/src/models';
import { storeFreeze } from 'ngrx-store-freeze';

import { Reducer as authReducer } from 'subrepos/authentication-api-ngx';
import { Reducer as deepstreamReducer, IDeepstreamState } from 'subrepos/deepstream-ngx';
import { CommonState, commonReducers, IAuthenticationState } from 'subrepos/gtrack-common-ngx';
import { ILocalizationState, Reducer as LanguageReducer } from 'app/language';

import { environment } from 'environments/environment';
import { IEditedHikeProgramState } from './state/hike-program';

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

//////////////
// Reducers
//////////////

import { hikeEditRoutePlannerReducer } from './reducer/hike-edit-route-planner';
import { hikeEditPoiReducer } from './reducer/hike-edit-poi';
import { hikeEditMapReducer } from './reducer/hike-edit-map';
import { editedHikeProgramReducer } from './reducer/edited-hike-program';
import { editedGTrackPoiReducer } from './reducer/edited-gtrack-poi';

//////////////
// State
//////////////

import { State } from './state';

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  ...commonReducers,
  router: routerReducer,
  hikeEditRoutePlanner: hikeEditRoutePlannerReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditMap: hikeEditMapReducer,
  language: LanguageReducer,
  editedHikeProgram: editedHikeProgramReducer,
  editedGtrackPoi: editedGTrackPoiReducer
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
export * from './state';
