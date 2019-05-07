import { ErrorHandler } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { selectRole, selectUser } from '@bit/garlictech.angular-features.common.authentication/store/selectors';
import {
  EXTERNAL_DEEPSTREAM_DEPENDENCIES,
  ExternalDeepstreamDependencies
} from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { CONFIG as LANGUAGE_CONFIG } from '@bit/garlictech.angular-features.common.localization';
import { createSelector } from '@ngrx/store';
import { environment } from 'environments/environment';
import _get from 'lodash-es/get';
import { ConfirmationService, MessageService } from 'primeng/api';

import { COGNITO_CONFIG } from '@bit/garlictech.angular-features.common.authentication-cognito/config';
import { WEATHER_CONFIG, WeatherConfig } from '@bit/garlictech.angular-features.common.weather';
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

export const userIdSelector = createSelector(
  selectUser,
  state => _get(state, 'id')
);

// tslint:disable-next-line:only-arrow-functions
export function externalDeepstreamDependencies(): ExternalDeepstreamDependencies {
  return {
    deepstreamConnectionString: environment.deepstream,
    selectors: { getUserId: userIdSelector, getUserRole: selectRole }
  };
}

const weatherConfig: WeatherConfig = {
  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78'
  }
};

export const APP_PROVIDERS = [
  TransferState,
  { provide: REDUCER_TOKEN, useFactory: getReducers },
  { provide: LANGUAGE_CONFIG, useValue: config.language },
  { provide: ErrorHandler, useClass: RavenErrorHandler },
  { provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES, useFactory: externalDeepstreamDependencies },
  { provide: COGNITO_CONFIG, useValue: environment.authentication.cognito },
  { provide: WEATHER_CONFIG, useValue: weatherConfig },
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
