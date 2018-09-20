export * from './admin-map';
export * from './hike-edit-map';
export * from './hike-edit-poi';
export * from './hike-edit-image';
export * from './hike-edit-route-planner';
export * from './hike-list';
export * from './edited-gtrack-poi';
export * from './edited-hike-program';

import * as adminMapActions from './admin-map';
export type AdminMapAction = adminMapActions.AllAdminMapActions;
export { adminMapActions };

import * as editedGTrackPoiActions from './edited-gtrack-poi';
export type EditedGTrackPoiAction = editedGTrackPoiActions.AllEditedGTrackPoiActions;
export { editedGTrackPoiActions };

import * as editedHikeProgramActions from './edited-hike-program';
export type EditedHikeProgramAction = editedHikeProgramActions.AllEditedHikeProgramActions;
export { editedHikeProgramActions };

import * as hikeEditActions from './hike-edit';
export type HikeEditAction = hikeEditActions.AllHikeEditActions;
export { hikeEditActions };

import * as hikeEditMapActions from './hike-edit-map';
export type HikeEditMapAction = hikeEditMapActions.AllHikeEditMapActions;
export { hikeEditMapActions };

import * as hikeEditPoiActions from './hike-edit-poi';
export type HikeEditPoiAction = hikeEditPoiActions.AllHikeEditPoiActions;
export { hikeEditPoiActions };

import * as hikeEditImageActions from './hike-edit-image';
export type HikeEditImageAction = hikeEditImageActions.AllHikeEditImageActions;
export { hikeEditImageActions };

import * as hikeEditRoutePlannerActions from './hike-edit-route-planner';
export type HikeEditRoutePlannerAction = hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions;
export { hikeEditRoutePlannerActions };

import * as hikeListActions from './hike-list';
export type HikeListAction = hikeListActions.AllHikeListActions;
export { hikeListActions };

import * as commonPoiActions from 'subrepos/gtrack-common-ngx/app/hike/store/poi/actions';
export type CommonPoiAction = commonPoiActions.AllPoiActions;
export { commonPoiActions };

import * as commonHikeActions from 'subrepos/gtrack-common-ngx/app/hike/store/hike/actions';
export type CommonHikeAction = commonHikeActions.AllHikeActions;
export { commonHikeActions };

import * as commonRouteActions from 'subrepos/gtrack-common-ngx/app/hike/store/route/actions';
export type CommonRouteAction = commonRouteActions.AllRouteActions;
export { commonRouteActions };

import * as commonGeoSearchActions from 'subrepos/gtrack-common-ngx/app/geosearch/store/actions';
export type CommonGeoSearchAction = commonGeoSearchActions.AllGeoSearchActions;
export { commonGeoSearchActions };

// tslint:disable:max-line-length
import * as commonBackgroundGeolocationActions from 'subrepos/gtrack-common-ngx/app/shared/services/background-geolocation-service/store/actions';
// tslint:enable:max-line-length
export { commonBackgroundGeolocationActions };
