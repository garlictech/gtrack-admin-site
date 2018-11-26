import { ActionReducerMap } from '@ngrx/store/src/models';

import { reducer as commonReducers, metaReducers } from 'subrepos/gtrack-common-web/store';

//////////////
// Reducers
//////////////

import { hikeEditRoutePlannerReducer } from './reducer/hike-edit-route-planner';
import { hikeEditPoiReducer } from './reducer/hike-edit-poi';
import { hikeEditImageReducer } from './reducer/hike-edit-image';
import { editedHikeProgramReducer } from './reducer/edited-hike-program';
import { editedGTrackPoiReducer } from './reducer/edited-gtrack-poi';

//////////////
// State
//////////////

import { State } from './state';
import { InjectionToken } from '@angular/core';

// Same keys as in the state!!!
export const reducer: ActionReducerMap<State> = {
  ...commonReducers,
  hikeEditRoutePlanner: hikeEditRoutePlannerReducer,
  hikeEditPoi: hikeEditPoiReducer,
  hikeEditImage: hikeEditImageReducer,
  editedHikeProgram: editedHikeProgramReducer,
  editedGtrackPoi: editedGTrackPoiReducer
};

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<State>>('Registered Reducers');

export function getReducers() {
  return reducer;
}

export * from './state';
export { metaReducers };
