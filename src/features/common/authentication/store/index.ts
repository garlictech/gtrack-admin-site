// tslint:disable: only-arrow-functions
import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';

import * as Actions from './actions';
import { reducer } from './reducer';
import * as Selectors from './selectors';

import { AuthenticationState } from './state';

export * from './state';
export { metaReducers } from './reducer';
export { Effects } from './effects';
export { Actions as AuthenticationActions };
export { Selectors as AuthenticationSelectors };

export function getReducers(): ActionReducer<AuthenticationState> {
  return reducer;
}

export const AUTHENTICATION_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AuthenticationState>>(
  'Registered Authentication Reducers'
);
