import { DeepstreamState } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { AuthenticationState } from '../authentication';
import { GeoSearchState } from '../geosearch';
import { HikeState, PoiState, RouteState } from '../hike';
import { ObjectMarkState } from '../object-mark';
import { SearchFilters } from '../search-filters';

// A module with store must export its reducers and its store interface - do it here, like in the example
// import * as Authentication from '../authentication/store'

// Add the store interface of the module to the global reducers.

// Extend the store interface with that.
export interface CommonState {
  deepstream: DeepstreamState;
  poi: PoiState;
  hike: HikeState;
  route: RouteState;
  geosearch: GeoSearchState;
  authentication: AuthenticationState;
  searchFilters: SearchFilters;
  objectMarks: ObjectMarkState;
}
