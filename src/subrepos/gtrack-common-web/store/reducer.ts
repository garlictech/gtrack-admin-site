import { ActionReducerMap, ActionReducer } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';

import { LOGOUT_SUCCESS } from 'subrepos/authentication-api-ngx/store/actions';
import { environment } from 'environments/environment';

import { commonReducers } from 'subrepos/gtrack-common-ngx/app/store/reducer';
import { Reducer as languageReducer } from 'subrepos/localize-ngx/store/reducer';

import { IState } from './state';

export const reducer: ActionReducerMap<IState> = {
  ...commonReducers,
  language: languageReducer,
  router: routerReducer
};

export function logger(_reducer: ActionReducer<any>): any {
  return storeLogger({
    collapsed: true
  })(_reducer);
}

export function logout(_reducer) {
  return function(state, action) {
    return _reducer(action.type === LOGOUT_SUCCESS ? undefined : state, action);
  };
}

const metaReducers = [logger, logout];

if (!environment.production) {
  metaReducers.push(storeFreeze);
}

export { metaReducers };
