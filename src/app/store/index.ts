import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { RouterState } from '@ngrx/router-store';
import { compose } from '@ngrx/core/compose';

import { IAuthenticationState, Reducer, domain as authDomain } from 'authentication-api-ngx';

import * as GtActions from './actions';
export { GtActions };

import { reducer as LayoutReducer } from './reducer';
export { LayoutReducer };

import { ILayoutState, layoutDomain } from './state';

export { Effects } from './effects';

// Add the store interface of the module to the global reducers.
let reducers = {};
const routerDomain = 'router';
reducers[authDomain] = Reducer;
reducers[layoutDomain] = LayoutReducer;
reducers[routerDomain] = routerReducer;

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  layout: ILayoutState;
  router: RouterState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducers));
