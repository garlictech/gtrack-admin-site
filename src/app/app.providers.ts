import { TransferState } from '@angular/platform-browser';

import { RoutePlannerService, RoutingControlService } from './shared/services/admin-map';
import { WaypointMarkerService } from './shared/services/admin-map/waypoint-marker.service';

import {
  EditedGTrackPoiSelectors,
  EditedHikeProgramSelectors,
  HikeEditPoiSelectors,
  HikeEditMapSelectors,
  HikeEditRoutePlannerSelectors,
  HikeEditImageSelectors
} from './store/selectors';

// Services
import {
  AdminMapService,
  PoiEditorService,
  WikipediaPoiService,
  OsmPoiService,
  OsmRoutePoiService,
  GooglePoiService,
  ReverseGeocodingService,
  LanguageService,
  HikeProgramService,
  MapillaryService
} from './shared/services';

import { REDUCER_TOKEN, getReducers } from './store';

export const APP_PROVIDERS = [
  TransferState,
  { provide: REDUCER_TOKEN, useFactory: getReducers },
  ReverseGeocodingService,
  AdminMapService,
  RoutePlannerService,
  RoutingControlService,
  WaypointMarkerService,
  PoiEditorService,
  WikipediaPoiService,
  OsmPoiService,
  OsmRoutePoiService,
  GooglePoiService,
  LanguageService,
  HikeProgramService,
  MapillaryService,
  EditedGTrackPoiSelectors,
  EditedHikeProgramSelectors,
  HikeEditPoiSelectors,
  HikeEditImageSelectors,
  HikeEditMapSelectors,
  HikeEditRoutePlannerSelectors
];
