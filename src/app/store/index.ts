// tslint:disable:only-arrow-functions

// State
import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

// Reducers
import { editedGTrackPoiReducer } from './reducer/edited-gtrack-poi';
import { editedHikeProgramReducer } from './reducer/edited-hike-program';
import { hikeEditImageReducer } from './reducer/hike-edit-image';
import { hikeEditPoiReducer } from './reducer/hike-edit-poi';
import { hikeEditRoutePlannerReducer } from './reducer/hike-edit-route-planner';
import { State } from './state';

// Same keys as in the state!!!
export const reducer: ActionReducerMap<State> = {
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
