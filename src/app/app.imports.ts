import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToasterModule } from 'angular2-toaster';
import { EffectsModule } from '@ngrx/effects';
import * as _ from 'lodash';
import { environment } from 'environments/environment';

import {
  GtrackCommonModule,
  SearchFiltersModule,
  DeepstreamModule,
  AuthenticationModule as CommonAuthenticationModule,
  SharedModule,
  HikeEffects,
  RouteEffects,
  PoiEffects,
  GeoSearchModule,
  GeoSearchEffects,
  defaultSharedConfig,
  IHikeModuleConfig,
  BackgroundGeolocationModule,
  BackgroundGeolocationEffects,
  HikeModule
} from 'subrepos/gtrack-common-ngx';
import { DeepstreamModule as CommonDeepstreamModule } from 'subrepos/deepstream-ngx';

import { defaultAuthenticationApiConfig, AuthenticationApiModule } from 'subrepos/authentication-api-ngx';

import { REDUCER_TOKEN, metaReducers } from './store';
import { LanguageModule } from './language';
import { CoreLayoutModule } from './core';
import { AuthModule } from './auth';
import { FormModule } from './forms';
import { HikeListModule } from './pages/hike-list';
import { HikeEditModule } from './pages/hike-edit';
import {
  HikeEditImageEffects,
  EditedGTrackPoiEffects,
  EditedHikeProgramEffects,
  HikeEditPoiEffects,
  AuthEffects
} from './store/effects';
import { GenericComponentsModule } from './generic-components';

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
  StoreRouterConnectingModule,
  CommonDeepstreamModule,
  DeepstreamModule.forRoot(),
  GtrackCommonModule,
  GenericComponentsModule,
  AuthenticationApiModule.forRoot(getConfig),
  LanguageModule,
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
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
  CommonAuthenticationModule,
  CoreLayoutModule,
  AuthModule,
  HikeListModule,
  HikeEditModule,
  EffectsModule.forRoot([
    AuthEffects,
    HikeEditPoiEffects,
    EditedHikeProgramEffects,
    EditedGTrackPoiEffects,
    HikeEditImageEffects,
    HikeEffects, PoiEffects, RouteEffects, GeoSearchEffects, BackgroundGeolocationEffects
  ]),
  ToasterModule.forRoot(),
  FormModule
];
