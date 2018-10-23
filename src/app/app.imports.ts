import _get from 'lodash-es/get';
import {
  AuthEffects,
  EditedGTrackPoiEffects,
  EditedHikeProgramEffects,
  HikeEditImageEffects,
  HikeEditPoiEffects
} from './store/effects';
import { AuthenticationApiModule, defaultAuthenticationApiConfig } from 'subrepos/authentication-api-ngx';
import { AuthModule } from './auth';
import {
  BackgroundGeolocationModule,
  DeepstreamModule,
  defaultSharedConfig,
  GeoSearchModule,
  HikeModule,
  IHikeModuleConfig,
  IObjectMarkModuleConfig,
  ObjectMarkModule,
  SearchFiltersModule,
  SharedModule
} from 'subrepos/gtrack-common-ngx';
import { CoreLayoutModule } from './core';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'environments/environment';
import { GenericUiModule } from '@web.features/generic-ui';
import { GtrackCommonWebModule } from 'subrepos/gtrack-common-web';
import { HikeEditModule } from './pages/hike-edit';
import { HikeListModule } from './pages/hike-list';
import { metaReducers, REDUCER_TOKEN } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
const sharedConfig = {
  ...defaultSharedConfig
};

export function getSharedConfig() {
  return sharedConfig;
}

const hikeModuleConfig: IHikeModuleConfig = {
  storeDomains: {
    hike: 'hike',
    poi: 'poi',
    route: 'route'
  }
};

const objectMarkConfig: IObjectMarkModuleConfig = {
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

export function getAuthConfig() {
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
  BackgroundGeolocationModule.forRoot(),
  GeoSearchModule.forRoot({
    storeDomain: 'geosearch'
  }),
  HikeModule.forRoot(hikeModuleConfig),
  BackgroundGeolocationModule.forRoot(),
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
  ToastModule
];
