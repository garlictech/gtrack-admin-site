import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as _ from 'lodash';

import { environment } from 'environments/environment';

import {
  DeepstreamModule,
  SharedModule,
  GeoSearchModule,
  defaultSharedConfig,
  IHikeModuleConfig,
  BackgroundGeolocationModule,
  HikeModule,
  SearchFiltersModule
} from 'subrepos/gtrack-common-ngx';

import { GtrackCommonWebModule } from 'subrepos/gtrack-common-web';
import { defaultAuthenticationApiConfig, AuthenticationApiModule } from 'subrepos/authentication-api-ngx';

import { REDUCER_TOKEN, metaReducers } from './store';

import { CoreLayoutModule } from './core';
import { AuthModule } from './auth';
import { HikeListModule } from './pages/hike-list';
import { HikeEditModule } from './pages/hike-edit';
import {
  HikeEditImageEffects,
  EditedGTrackPoiEffects,
  EditedHikeProgramEffects,
  HikeEditPoiEffects,
  AuthEffects
} from './store/effects';
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

const authConfig = {
  ...defaultAuthenticationApiConfig
};

authConfig.apiUrl = environment.authentication.server;
authConfig.webserverUrl = environment.webappServer;
authConfig.facebook.appId = _.get(environment, 'authentication.facebook.appId');
authConfig.google.appId = _.get(environment, 'authentication.google.appId');
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
  GtrackCommonWebModule,
  ToastModule
];
