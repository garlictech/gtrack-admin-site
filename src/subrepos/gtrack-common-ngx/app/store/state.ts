import { IDeepstreamState } from '../../../deepstream-ngx';
import { IAuthenticationState } from '../authentication';
import { IPoiState, IHikeState, IRouteState } from '../hike';
import { IGeoSearchState } from '../geosearch';
import { IBackgroundGeolocationState } from './reducers/background-geolocation';
import { ISearchFilterState } from '../search-filters';

// A module with store must export its reducers and its store interface - do it here, like in the example
// import * as Authentication from '../authentication/store'

// Add the store interface of the module to the global reducers.

// Extend the store interface with that.
export interface CommonState {
  deepstream: IDeepstreamState;
  poi: IPoiState;
  hike: IHikeState;
  route: IRouteState;
  geosearch: IGeoSearchState;
  authentication: IAuthenticationState;
  geolocation: IBackgroundGeolocationState | null;
  searchFilters: ISearchFilterState;
}
