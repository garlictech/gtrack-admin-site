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
import { AdminMapActions } from './admin-map';
export { AdminMapActions };
import { RouteInfoDataActions } from './admin-map-route-info-data';
export { RouteInfoDataActions };
import { LayoutActions } from './layout';
export { LayoutActions };
import { RoutingActions } from './routing';
export { RoutingActions };
import { HikeEditRoutePlanningActions } from './hike-edit-route-planning';
export { HikeEditRoutePlanningActions };
import { HikeEditPoiActions } from './hike-edit-poi';
export { HikeEditPoiActions };

// Effects
export { AuthEffects } from './auth';
export { HikeEditRoutePlanningEffects } from './hike-edit-route-planning';
export { HikeEditPoiEffects } from './hike-edit-poi';

// States
import { IRouteInfoDataState, routeInfoDataDomain } from './admin-map-route-info-data/state';
export { IRouteInfoDataState }
import { ILayoutState, layoutDomain } from './layout/state';
export { ILayoutState }
import { IHikeEditMapState, hikeEditMapDomain } from './hike-edit-map';
export { IHikeEditMapState }
import { IHikeEditPoiState, hikeEditPoiDomain } from './hike-edit-poi';
export { IHikeEditPoiState }

// Reducers
import { routeInfoDataReducer } from './admin-map-route-info-data/reducer';
export { routeInfoDataReducer };
import { layoutReducer } from './layout/reducer';
export { layoutReducer };
import { hikeEditMapReducer } from './hike-edit-map';
export { hikeEditMapReducer };
import { hikeEditPoiReducer } from './hike-edit-poi';
export { hikeEditPoiReducer };

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
