import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { hikeReducer } from './reducer';
import { HikeState } from './state';

export * from './actions';
export * from './effects';
export * from './reducer';
export * from './selectors';
export * from './state';

// tslint:disable-next-line: only-arrow-functions
export function getReducers(): ActionReducer<HikeState> {
  return hikeReducer;
}

export const HIKE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<HikeState>>('Registered Hike Reducers');
