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

export { AuthEffects, HikeEditEffects, HikeEditPoiEffects } from './effects';
export { PoiEffects } from 'subrepos/gtrack-common-ngx';

//////////////
// Reducers
//////////////

import {
  hikeEditRoutePlannerReducer, hikeEditMapReducer, hikeEditPoiReducer,
  editedGTrackPoiReducer, editedHikeProgramReducer, hikeEditGeneralInfoReducer
} from './reducer';

export {
  hikeEditRoutePlannerReducer, hikeEditMapReducer, hikeEditPoiReducer
};

//////////////
// State
//////////////

import { State } from './state';
import { IEditedHikeProgramState } from './state/hike-program';

// Same keys as in the state!!!
const reducers: ActionReducerMap<State> = {
  ...commonReducers,
  router: routerReducer,
  hikeEditRoutePlanner: hikeEditRoutePlannerReducer,
  hikeEditGeneralInfo: hikeEditGeneralInfoReducer,
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
