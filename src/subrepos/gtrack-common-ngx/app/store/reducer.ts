import { Reducer as deepstreamReducer } from 'subrepos/deepstream-ngx';
import { Reducer as authReducer } from '../authentication';
import { poiReducer } from '../hike/store/poi/reducer';
import { hikeReducer } from '../hike/store/hike/reducer';
import { routeReducer } from '../hike/store/route/reducer';
import { geoSearchReducer } from '../geosearch';
import { reducer as backgroundGeolocationReducer } from './reducers/background-geolocation';
import { searchFiltersReducer } from '../search-filters';

export const commonReducers = {
  deepstream: deepstreamReducer,
  poi: poiReducer,
  hike: hikeReducer,
  route: routeReducer,
  geosearch: geoSearchReducer,
  authentication: authReducer,
  geolocation: backgroundGeolocationReducer,
  searchFilters: searchFiltersReducer
};
