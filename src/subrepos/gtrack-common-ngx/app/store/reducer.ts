import { Reducer as deepstreamReducer } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { Reducer as authReducer } from '../authentication';
import { geoSearchReducer } from '../geosearch';
import { hikeReducer } from '../hike/store/hike/reducer';
import { poiReducer } from '../hike/store/poi/reducer';
import { routeReducer } from '../hike/store/route/reducer';
import { objectMarkReducer } from '../object-mark';
import { searchFiltersReducer } from '../search-filters';

export const commonReducers = {
  deepstream: deepstreamReducer,
  poi: poiReducer,
  hike: hikeReducer,
  route: routeReducer,
  geosearch: geoSearchReducer,
  authentication: authReducer,
  searchFilters: searchFiltersReducer,
  objectMarks: objectMarkReducer
};
