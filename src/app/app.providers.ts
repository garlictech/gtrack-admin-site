import { ConfirmationService, MessageService } from 'primeng/api';

import { ErrorHandler } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { CONFIG as LANGUAGE_CONFIG } from '@bit/garlictech.angular-features.common.localization';

import { RouteRedirectGuard } from './auth';
import { config } from './config';
import { RavenErrorHandler } from './raven';
// Services
import {
  AdminLanguageService,
  AdminMapService,
  FlickrService,
  GooglePoiService,
  HikeProgramService,
  MapillaryService,
  OsmPoiService,
  PoiEditorService,
  ReverseGeocodingService,
  WikipediaPoiService
} from './shared/services';
import { RoutePlannerService } from './shared/services/admin-map';
import { WaypointMarkerService } from './shared/services/admin-map/waypoint-marker.service';
import { getReducers, REDUCER_TOKEN } from './store';

export const APP_PROVIDERS = [
  TransferState,
  { provide: REDUCER_TOKEN, useFactory: getReducers },
  { provide: LANGUAGE_CONFIG, useValue: config.language },
  { provide: ErrorHandler, useClass: RavenErrorHandler },
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
  AdminLanguageService,
  HikeProgramService,
  FlickrService,
  MapillaryService,
  ConfirmationService,
  MessageService
];
