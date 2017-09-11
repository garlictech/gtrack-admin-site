import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { IAuthenticationState, Reducer, domain as authDomain } from 'authentication-api-ngx';

// Add the store interface of the module to the global reducers.
let reducer = {};

reducer[authDomain] = Reducer;

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducer));
