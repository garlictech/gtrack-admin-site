import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { RouterState } from '@ngrx/router-store';
import { compose } from '@ngrx/core/compose';

// Subrepos
import {
  IAuthenticationState,
  Reducer as authReducer,
  domain as authDomain
} from '../../subrepos/authentication-api-ngx';
import {
  Reducer as deepstreamReducer,
  IDeepstreamState
} from '../../subrepos/gtrack-common-ngx/subrepos/deepstream-ngx';

// Actions
export {
  AdminMapActions,
  RouteInfoDataActions,
  LayoutActions,
  RoutingActions,
  HikeEditRoutePlanningActions,
  HikeEditPoiActions
} from './actions';

// Effects
export {
  AuthEffects,
  HikeEditRoutePlanningEffects,
  HikeEditPoiEffects
} from './effects';

// States
import {
  IRouteInfoDataState,
  routeInfoDataDomain,
  ILayoutState,
  layoutDomain,
  IHikeEditMapState,
  hikeEditMapDomain,
  IHikeEditPoiState,
  hikeEditPoiDomain
} from './state';
export {
  IRouteInfoDataState,
  ILayoutState,
  IHikeEditMapState,
  IHikeEditPoiState
}

// Reducers
import {
  routeInfoDataReducer,
  layoutReducer,
  hikeEditMapReducer,
  hikeEditPoiReducer
} from './reducer';
export {
  routeInfoDataReducer,
  layoutReducer,
  hikeEditMapReducer,
  hikeEditPoiReducer
};

// Add the store interface of the module to the global reducers.
let reducers = {
  'router': routerReducer,
  'deepstream': deepstreamReducer
};
reducers[authDomain] = authReducer;
reducers[routeInfoDataDomain] = routeInfoDataReducer;
reducers[layoutDomain] = layoutReducer;
reducers[hikeEditMapDomain] = hikeEditMapReducer;
reducers[hikeEditPoiDomain] = hikeEditPoiReducer;

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  routeInfoData: IRouteInfoDataState;
  layout: ILayoutState;
  hikeEditMap: IHikeEditMapState;
  hikeEditPoi: IHikeEditPoiState;
  router: RouterState; // ngrx/router
  deepstream: IDeepstreamState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducers));
