import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { routeReducer } from './reducer';
import { RouteState } from './state';

export * from './actions';
export * from './effects';
export * from './reducer';
export * from './selectors';
export * from './state';

// tslint:disable-next-line: only-arrow-functions
export function getReducers(): ActionReducer<RouteState> {
  return routeReducer;
}

export const ROUTE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<RouteState>>('Registered Route Reducers');
