import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { RouterState } from '@ngrx/router-store';
import { compose } from '@ngrx/core/compose';

import * as GtActions from './actions';
export { GtActions };

export { Effects } from './effects';

import { IAuthenticationState, Reducer as authReducer, domain as authDomain } from '../../subrepos/authentication-api-ngx';
import { Reducer as deepstreamReducer, IDeepstreamState } from '../../subrepos/gtrack-common-ngx/subrepos/deepstream-ngx';

import { ILayoutState, layoutDomain } from './state';
import { reducer as layoutReducer } from './reducer';
export { layoutReducer };

// Add the store interface of the module to the global reducers.
const routerDomain = 'router';
const deepstreamDomain = 'deepstream';

let reducers = {
  authDomain: authReducer,
  layoutDomain: layoutReducer,
  routerDomain: routerReducer,
  deepstreamDomain: deepstreamReducer
};

/*
reducers[authDomain] = authReducer;
reducers[layoutDomain] = layoutReducer;
reducers[routerDomain] = routerReducer;
reducers[deepstreamDomain] = deepstreamReducer;
*/

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  layout: ILayoutState;
  router: RouterState;
  deepstream: IDeepstreamState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducers));
