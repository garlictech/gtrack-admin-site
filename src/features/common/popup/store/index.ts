import * as Actions from './actions';

import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { Reducer } from './reducer';
import { PopupState } from './state';

export { Actions };
export * from './state';
export { Reducer } from './reducer';
export * from './selectors';

// tslint:disable-next-line: only-arrow-functions
export function getReducers(): ActionReducer<PopupState> {
  return Reducer;
}

export const POPUP_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<PopupState>>('Registered Popup Reducers');
