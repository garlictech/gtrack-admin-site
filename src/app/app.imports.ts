import { StoreModule } from '@ngrx/store';
import { ToasterModule } from 'angular2-toaster';
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

const sharedConfig = { ...defaultSharedConfig };

const hikeModuleConfig: IHikeModuleConfig = {
  storeDomains: {
    hike: 'hike',
    poi: 'poi',
    route: 'route'
  }
};

const config = {
  ...defaultAuthenticationApiConfig
};

config.apiUrl = environment.authentication.server;
config.webserverUrl = environment.webappServer;
config.facebook.appId = _.get(environment, 'authentication.facebook.appId');
config.google.appId = _.get(environment, 'authentication.google.appId');
config.magiclink = { redirectSlug: '/auth/magiclink' };

export function getConfig() {
  return config;
}

export const APP_IMPORTS = [
  StoreModule.forRoot(REDUCER_TOKEN, {
    metaReducers
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
  DeepstreamModule.forRoot(),
  AuthenticationApiModule.forRoot(getConfig),
  SearchFiltersModule.forRoot({
    storeDomain: 'searchFilters'
  }),
  SharedModule.forRoot(sharedConfig),
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
  ToasterModule.forRoot(),
  GtrackCommonWebModule
];
