// tslint:disable:only-arrow-functions
import { routerReducer } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';

import { environment } from 'environments/environment';

import { commonReducers } from 'subrepos/gtrack-common-ngx/app/store/reducer';

import { Reducer as languageReducer } from '@bit/garlictech.angular-features.common.localization/store/reducer';

import { LOGOUT_SUCCESS } from '@bit/garlictech.angular-features.common.authentication-api/store/actions';
import { State } from './state';

export const reducer: ActionReducerMap<State> = {
  ...commonReducers,
  language: languageReducer,
  router: routerReducer
};

export function logger(_reducer: ActionReducer<any>): any {
  return storeLogger({
    collapsed: true
  })(_reducer);
}

export function logout(_reducer: any): any {
  return function(state: any, action: any): any {
    return _reducer(action.type === LOGOUT_SUCCESS ? undefined : state, action);
  };
}

const metaReducers = environment.production ? [logger, logout] : [logger, logout, storeFreeze];

export { metaReducers };
