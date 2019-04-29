import { environment } from 'environments/environment';
import _get from 'lodash-es/get';
import { ToastModule } from 'primeng/toast';

import { HttpClient } from '@angular/common/http';
import {
  AuthenticationApiModule,
  defaultAuthenticationApiConfig
} from '@bit/garlictech.angular-features.common.authentication-api';
import { CurrentGeolocationModule } from '@bit/garlictech.angular-features.common.current-geolocation';
import { DeepstreamModule } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { GeoSearchModule } from '@bit/garlictech.angular-features.common.geosearch';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
import { WeatherConfig, WeatherModule } from '@bit/garlictech.angular-features.common.weather';
import { GenericUiModule } from '@bit/garlictech.angular-features.web.generic-ui-primeng';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ObjectMarkModule, ObjectMarkModuleConfig } from '@features/common/object-mark';
import { AuthModule } from './auth';
import { CoreLayoutModule } from './core';
import { HikeEditModule } from './pages/hike-edit';
import { HikeListModule } from './pages/hike-list';
import { REDUCER_TOKEN } from './store';
import {
  AuthEffects,
  EditedGTrackPoiEffects,
  EditedHikeProgramEffects,
  HikeEditImageEffects,
  HikeEditPoiEffects
} from './store/effects';

// tslint:disable-next-line:only-arrow-functions
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const weatherConfig: WeatherConfig = {
  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78'
  }
};

const objectMarkConfig: ObjectMarkModuleConfig = {
  storeDomain: 'objectMarks'
};

const authConfig = {
  ...defaultAuthenticationApiConfig
};

authConfig.apiUrl = environment.authentication.server;
authConfig.webserverUrl = environment.webappServer;
authConfig.facebook.appId = _get(environment, 'authentication.facebook.appId');
authConfig.google.appId = _get(environment, 'authentication.google.appId');
authConfig.magiclink = { redirectSlug: '/auth/magiclink' };

// tslint:disable-next-line:only-arrow-functions
export function getAuthConfig(): any {
  return authConfig;
}

export const APP_IMPORTS = [
  StoreModule.forRoot(REDUCER_TOKEN, {
    // metaReducers
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
  GenericUiModule,
  DeepstreamModule,
  AuthenticationApiModule.forRoot(getAuthConfig),
  SearchFiltersModule,
  GeoSearchModule,
  CoreLayoutModule,
  AuthModule,
  HikeListModule,
  HikeEditModule,
  EffectsModule.forRoot([
    AuthEffects,
    HikeEditPoiEffects,
    EditedHikeProgramEffects,
    EditedGTrackPoiEffects,
    HikeEditImageEffects
  ]),
  ObjectMarkModule.forRoot(objectMarkConfig),
  CurrentGeolocationModule.forRoot({ timeOut: 2000 }, { endpoint: environment.lambdaEndpoint }),
  LeafletMapModule,
  MarkerIconsModule.forRoot(),
  ToastModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
  WeatherModule.forRoot(weatherConfig)
];
