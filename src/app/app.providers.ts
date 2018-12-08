import { TransferState } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/api';

import { CONFIG as LANGUAGE_CONFIG } from 'subrepos/localize-ngx';

import { RouteRedirectGuard } from './auth';
import { RoutePlannerService } from './shared/services/admin-map';
import { WaypointMarkerService } from './shared/services/admin-map/waypoint-marker.service';
import { MarkerPopupService } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker/marker-popup.service';

// Services
import {
  AdminMapService,
  PoiEditorService,
  WikipediaPoiService,
  OsmPoiService,
  // OsmRoutePoiService,
  GooglePoiService,
  ReverseGeocodingService,
  LanguageService,
  HikeProgramService,
  MapillaryService,
  FlickrService
} from './shared/services';

import { REDUCER_TOKEN, getReducers } from './store';

import { config } from './config';

import { MessageService } from 'primeng/api';

export const APP_PROVIDERS = [
  TransferState,
  { provide: REDUCER_TOKEN, useFactory: getReducers },
  { provide: LANGUAGE_CONFIG, useValue: config.language },
  ReverseGeocodingService,
  RouteRedirectGuard,
  AdminMapService,
  RoutePlannerService,
  WaypointMarkerService,
  PoiEditorService,
  WikipediaPoiService,
  OsmPoiService,
  // OsmRoutePoiService,
  GooglePoiService,
  LanguageService,
  HikeProgramService,
  FlickrService,
  MapillaryService,
  ConfirmationService,
  MarkerPopupService,
  MessageService
];
