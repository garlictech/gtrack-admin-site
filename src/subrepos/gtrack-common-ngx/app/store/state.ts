import { DeepstreamState } from '@bit/garlictech.angular-features.common.deepstream-ngx';

import { AuthenticationState } from '../authentication';
import { HikeState, PoiState, RouteState } from '../hike';
import { ObjectMarkState } from '../object-mark';

// A module with store must export its reducers and its store interface - do it here, like in the example
// import * as Authentication from '../authentication/store'

// Add the store interface of the module to the global reducers.

// Extend the store interface with that.
export interface CommonState {
  deepstream: DeepstreamState;
  poi: PoiState;
  hike: HikeState;
  route: RouteState;
  authentication: AuthenticationState;
  objectMarks: ObjectMarkState;
}
