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

import {
  geoSearchReducer,
  IGeoSearchState
} from '../geosearch';

import {
  userStatusReducer,
  IUserStatusState
} from '../user-status';

// A module with store must export its reducers and its store interface - do it here, like in teh example
// import * as Authentication from '../authentication/store'

// Add the store interface of the module to the global reducers.

// Extend the store interface with that.
export interface CommonState {
  deepstream: IDeepstreamState,
  poi: IPoiState,
  hike: IHikeState,
  route: IRouteState,
  geosearch: IGeoSearchState,
  userStatus: IUserStatusState
}

export const commonReducers = {
  deepstream: deepstreamReducer,
  poi: poiReducer,
  hike: hikeReducer,
  route: routeReducer,
  geosearch: geoSearchReducer,
  userStatus: userStatusReducer
};
