// tslint:disable:only-arrow-functions
import { metaReducers, reducer as commonReducers } from 'subrepos/gtrack-common-web/store';

// State
import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store/src/models';

// Reducers
import { editedGTrackPoiReducer } from './reducer/edited-gtrack-poi';
import { editedHikeProgramReducer } from './reducer/edited-hike-program';
import { hikeEditImageReducer } from './reducer/hike-edit-image';
import { hikeEditPoiReducer } from './reducer/hike-edit-poi';
import { hikeEditRoutePlannerReducer } from './reducer/hike-edit-route-planner';
import { State } from './state';

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

export function getReducers(): ActionReducerMap<State> {
  return reducer;
}

export * from './state';
export { metaReducers };
