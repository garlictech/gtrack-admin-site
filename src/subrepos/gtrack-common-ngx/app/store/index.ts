import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { compose, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';

import { IAuthenticationState, Reducer as authReducer, domain as authDomain } from 'subrepos/authentication-api-ngx';
import { Reducer as deepstreamReducer, IDeepstreamState, DeepstreamService } from 'subrepos/deepstream-ngx';

import {
  poiReducer,
  IPoiState,
  hikeReducer,
  IHikeState,
  routeReducer,
  IRouteState
} from '../hike';

// A module with store must export its reducers and its store interface - do it here, like in teh example
// import * as Authentication from '../authentication/store'

// Add the store interface of the module to the global reducers.

// Extend the store interface with that.
export interface CommonState {
  jwtAuthentication: IAuthenticationState,
  deepstream: IDeepstreamState,
  poi: IPoiState,
  hike: IHikeState,
  route: IRouteState
}

export const commonReducers: ActionReducerMap<CommonState> = {
  jwtAuthentication: authReducer,
  deepstream: deepstreamReducer,
  poi: poiReducer,
  hike: hikeReducer,
  route: routeReducer
};
