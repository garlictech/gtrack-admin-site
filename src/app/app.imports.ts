import { environment } from 'environments/environment';
import _get from 'lodash-es/get';
import { ToastModule } from 'primeng/toast';
import { AuthenticationApiModule, defaultAuthenticationApiConfig } from 'subrepos/authentication-api-ngx';
import {
  DeepstreamModule,
  defaultSharedConfig,
  GeoSearchModule,
  HikeModule,
  HikeModuleConfig,
  ObjectMarkModule,
  ObjectMarkModuleConfig,
  SearchFiltersModule,
  SharedModule
} from 'subrepos/gtrack-common-ngx';
import { GtrackCommonWebModule } from 'subrepos/gtrack-common-web';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CurrentGeolocationModule } from '@bit/garlictech.angular-features.common.current-geolocation';
import { GenericUiModule } from '@bit/garlictech.angular-features.common.generic-ui';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
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

const sharedConfig = {
  ...defaultSharedConfig
};

// tslint:disable-next-line:only-arrow-functions
export function getSharedConfig(): any {
  return sharedConfig;
}

const hikeModuleConfig: HikeModuleConfig = {
  storeDomains: {
    hike: 'hike',
    poi: 'poi',
    route: 'route'
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
    metaReducers
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
  DeepstreamModule.forRoot(),
  AuthenticationApiModule.forRoot(getAuthConfig),
  SearchFiltersModule.forRoot({
    storeDomain: 'searchFilters'
  }),
  SharedModule.forRoot(getSharedConfig),
  GeoSearchModule.forRoot({
    storeDomain: 'geosearch'
  }),
  HikeModule.forRoot(hikeModuleConfig),
  CurrentGeolocationModule.forRoot({ timeOut: 2000 }, { endpoint: environment.lambdaEndpoint }),
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
  GtrackCommonWebModule,
  GenericUiModule,
  LeafletMapModule,
  ToastModule
];
