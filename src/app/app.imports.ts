import { environment } from 'environments/environment';
import _get from 'lodash-es/get';
import { ToastModule } from 'primeng/toast';

import { HttpClient } from '@angular/common/http';
import { AuthenticationModule } from '@bit/garlictech.angular-features.common.authentication';
import {
  AuthenticationApiModule,
  defaultAuthenticationApiConfig
} from '@bit/garlictech.angular-features.common.authentication-api';
import { CurrentGeolocationModule } from '@bit/garlictech.angular-features.common.current-geolocation';
import { DeepstreamModule } from '@bit/garlictech.angular-features.common.deepstream-ngx/src/lib';
import { GeoSearchModule } from '@bit/garlictech.angular-features.common.geosearch';
import { HikeComponentsModule } from '@bit/garlictech.angular-features.common.hike';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { ObjectMarkModule, ObjectMarkModuleConfig } from '@bit/garlictech.angular-features.common.object-mark';
import { PoiComponentsModule } from '@bit/garlictech.angular-features.common.poi';
import { RouteComponentsModule } from '@bit/garlictech.angular-features.common.route';
import { RouterModule } from '@bit/garlictech.angular-features.common.router';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
import { WeatherModule } from '@bit/garlictech.angular-features.common.weather';
import { GenericUiModule } from '@bit/garlictech.angular-features.web.generic-ui-primeng';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthModule } from './auth';
import { CoreLayoutModule } from './core';
import { HikeEditModule } from './pages/hike-edit';
import { HikeListModule } from './pages/hike-list';
import { metaReducers, REDUCER_TOKEN } from './store';
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
    metaReducers
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
  DeepstreamModule,
  RouterModule,
  GenericUiModule,
  AuthModule,
  AuthenticationModule,
  AuthenticationApiModule.forRoot(getAuthConfig),
  SearchFiltersModule,
  GeoSearchModule,
  CoreLayoutModule,
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
  HikeListModule,
  HikeEditModule,
  ToastModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
  WeatherModule,
  HikeComponentsModule,
  PoiComponentsModule,
  RouteComponentsModule
];
