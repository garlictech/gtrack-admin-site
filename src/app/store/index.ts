import { environment } from 'environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

// tslint:disable:only-arrow-functions
// State
import { InjectionToken } from '@angular/core';
// Reducers
import { ActionReducer, ActionReducerMap } from '@ngrx/store';

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

export function logger(_reducer: ActionReducer<any>): any {
  return storeLogger({
    collapsed: true
  })(_reducer);
}

const metaReducers = environment.production ? [logger] : [logger, storeFreeze];

export * from './state';
export { metaReducers };
