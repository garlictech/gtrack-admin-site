// tslint:disable:only-arrow-functions
import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';

import { reducer } from './reducer';
import { SettingsState } from './state';

import * as Actions from './actions';
import * as SettingsSelectors from './selectors';
export { Actions, SettingsSelectors };

export { Effects } from './effects';
export { reducer as Reducer } from './reducer';
export * from './state';

export function getReducers(): ActionReducer<SettingsState> {
  return reducer;
}

export const SETTINGS_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<SettingsState>>(
  'Registered Settings Reducers'
);
