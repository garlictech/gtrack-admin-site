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
import { LayoutActions } from './layout';
export { LayoutActions };
import { RoutingActions } from './routing';
export { RoutingActions };
import { HikeEditMapActions } from './hike-edit-map';
export { HikeEditMapActions };
import { HikeEditRoutePlanningActions } from './hike-edit-route-planning';
export { HikeEditRoutePlanningActions };

// Effects
export { AuthEffects } from './auth';
export { HikeEditMapEffects } from './hike-edit-map';
export { HikeEditRoutePlanningEffects } from './hike-edit-route-planning';

// States
import { ILayoutState, layoutDomain } from './layout/state';
import { IHikeEditMapState, hikeEditMapDomain } from './hike-edit-map';
export { IHikeEditMapState }

// Reducers
import { layoutReducer } from './layout/reducer';
export { layoutReducer };
import { hikeEditMapReducer } from './hike-edit-map';
export { hikeEditMapReducer };

// Add the store interface of the module to the global reducers.
let reducers = {
  'router': routerReducer,
  'deepstream': deepstreamReducer
};
reducers[authDomain] = authReducer;
reducers[layoutDomain] = layoutReducer;
reducers[hikeEditMapDomain] = hikeEditMapReducer;

// Extend the store interface with that.
export interface State {
  authentication: IAuthenticationState;
  layout: ILayoutState;
  hikeEditMap: IHikeEditMapState;
  router: RouterState; // ngrx/router
  deepstream: IDeepstreamState;
}

export const store = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducers));
