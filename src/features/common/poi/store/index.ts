import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { poiReducer } from './reducer';
import { PoiState } from './state';

export * from './actions';
export * from './effects';
export * from './reducer';
export * from './selectors';
export * from './state';

// tslint:disable-next-line: only-arrow-functions
export function getReducers(): ActionReducer<PoiState> {
  return poiReducer;
}

export const POI_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<PoiState>>('Registered Poi Reducers');
