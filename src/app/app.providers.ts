import { TransferState } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/primeng';

import { CONFIG as LANGUAGE_CONFIG } from 'subrepos/localize-ngx';

import { RoutePlannerService } from './shared/services/admin-map';
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

import { config } from './config';

export const APP_PROVIDERS = [
  TransferState,
  { provide: REDUCER_TOKEN, useFactory: getReducers },
  { provide: LANGUAGE_CONFIG, useValue: config.language },
  ReverseGeocodingService,
  AdminMapService,
  RoutePlannerService,
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
  HikeEditRoutePlannerSelectors,
  ConfirmationService
];
