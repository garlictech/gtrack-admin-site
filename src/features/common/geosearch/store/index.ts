// tslint:disable:only-arrow-functions
import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import * as GeoSearchActions from './actions';
import { geoSearchReducer } from './reducer';
import { GeoSearchState } from './state';

export { GeoSearchActions };
export * from './effects';
export * from './reducer';
export * from './selectors';
export * from './state';

export function getReducers(): ActionReducer<GeoSearchState> {
  return geoSearchReducer;
}

export const GEO_SEARCH_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<GeoSearchState>>(
  'Registered GeoSearch Reducers'
);
