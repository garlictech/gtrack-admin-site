import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import { reducer } from './reducer';
import { ISettingsState } from './state';

import * as Actions from './actions';
import * as Selectors from './selectors';
export { Actions, Selectors };
export { Effects } from './effects';
export { reducer as Reducer } from './reducer';
export * from './state';

export function getReducers() {
  return reducer;
}

export const SETTINGS_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<ISettingsState>>('Registered Settings Reducers');
