// tslint:disable:max-line-length
import * as commonBackgroundGeolocationActions from '@bit/garlictech.angular-features.common.current-geolocation/store/actions';
// tslint:disable:no-property-initializers max-classes-per-file
import * as commonGeoSearchActions from '@bit/garlictech.angular-features.common.geosearch/store/actions';
import * as commonHikeActions from '@features/common/hike/store/actions';
import * as commonPoiActions from '@features/common/poi/store/actions';
import * as commonRouteActions from '@features/common/route/store/actions';
import * as routingActions from '@features/common/router/store/actions';

import * as editedGTrackPoiActions from './edited-gtrack-poi';
import * as editedHikeProgramActions from './edited-hike-program';
import * as hikeEditActions from './hike-edit';
import * as hikeEditImageActions from './hike-edit-image';
import * as hikeEditPoiActions from './hike-edit-poi';
import * as hikeEditRoutePlannerActions from './hike-edit-route-planner';
import * as hikeListActions from './hike-list';

export * from './hike-edit-poi';
export * from './hike-edit-image';
export * from './hike-edit-route-planner';
export * from './hike-list';
export * from './edited-gtrack-poi';
export * from './edited-hike-program';

export type EditedGTrackPoiAction = editedGTrackPoiActions.AllEditedGTrackPoiActions;
export { editedGTrackPoiActions };

export type EditedHikeProgramAction = editedHikeProgramActions.AllEditedHikeProgramActions;
export { editedHikeProgramActions };

export type HikeEditAction = hikeEditActions.AllHikeEditActions;
export { hikeEditActions };

export type HikeEditPoiAction = hikeEditPoiActions.AllHikeEditPoiActions;
export { hikeEditPoiActions };

export type HikeEditImageAction = hikeEditImageActions.AllHikeEditImageActions;
export { hikeEditImageActions };

export type HikeEditRoutePlannerAction = hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions;
export { hikeEditRoutePlannerActions };

export type HikeListAction = hikeListActions.AllHikeListActions;
export { hikeListActions };

export type CommonPoiAction = commonPoiActions.AllPoiActions;
export { commonPoiActions };

export type CommonHikeAction = commonHikeActions.AllHikeActions;
export { commonHikeActions };

export type CommonRouteAction = commonRouteActions.AllRouteActions;
export { commonRouteActions };

export type CommonGeoSearchAction = commonGeoSearchActions.AllGeoSearchActions;
export { commonGeoSearchActions };

export type RoutingAction = routingActions.AllActions;
export { routingActions };

// tslint:enable:max-line-length
export { commonBackgroundGeolocationActions };
