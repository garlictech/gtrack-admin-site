import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { IAuthenticationState, Reducer, domain as authDomain } from 'authentication-api-ngx';

import * as LayoutActions from './layout.action';
export { LayoutActions };

import { reducer as LayoutReducer } from './layout.reducer';
export { LayoutReducer };

import { ILayoutState, domain as layoutDomain } from './layout.state';

// Add the store interface of the module to the global reducers.
let reducer = {};

reducer[authDomain] = Reducer;
reducer[layoutDomain] = LayoutReducer;

// Extend the store interface with that.
export interface State {
    authentication: IAuthenticationState;
    layout: ILayoutState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducer));
