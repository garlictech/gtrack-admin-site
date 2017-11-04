import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { RouterState } from '@ngrx/router-store';
import { compose } from '@ngrx/core/compose';

import {
  IAuthenticationState,
  Reducer as authReducer,
  domain as authDomain
} from '../../subrepos/authentication-api-ngx';
import {
  Reducer as deepstreamReducer,
  IDeepstreamState
} from '../../subrepos/gtrack-common-ngx/subrepos/deepstream-ngx';

import { Actions } from './actions';
export { Actions };

export { Effects } from './effects';

import { ILayoutState, layoutDomain } from './state';
import { layoutReducer } from './reducer';
export { layoutReducer };

// Add the store interface of the module to the global reducers.
let reducers = {
  authDomain: authReducer,
  layoutDomain: layoutReducer,
  'router': routerReducer,
  'deepstream': deepstreamReducer
};

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  layout: ILayoutState;
  router: RouterState; // ngrx/router
  deepstream: IDeepstreamState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducers));
