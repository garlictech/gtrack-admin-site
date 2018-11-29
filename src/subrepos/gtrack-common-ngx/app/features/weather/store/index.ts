import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import { weatherReducer } from './reducer';
import { IWeatherState } from './state';

export * from './actions';
export * from './selectors';
export * from './effects';
export * from './reducer';
export * from './state';

export function getReducers() {
  return weatherReducer;
}

export const WEATHER_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<IWeatherState>>('Registered Weather Reducers');
