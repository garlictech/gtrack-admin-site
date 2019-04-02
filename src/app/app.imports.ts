import { environment } from 'environments/environment';
import _get from 'lodash-es/get';
import { ToastModule } from 'primeng/toast';
import {
  DeepstreamModule,
  defaultSharedConfig,
  HikeModule,
  HikeModuleConfig,
  ObjectMarkModule,
  ObjectMarkModuleConfig,
  SharedModule
} from 'subrepos/gtrack-common-ngx';
import { GtrackCommonWebModule } from 'subrepos/gtrack-common-web';

import {
  AuthenticationApiModule,
  defaultAuthenticationApiConfig
} from '@bit/garlictech.angular-features.common.authentication-api';
import { CurrentGeolocationModule } from '@bit/garlictech.angular-features.common.current-geolocation';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { GenericUiModule } from '@bit/garlictech.angular-features.web.generic-ui-primeng';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { GeoSearchModule } from '@bit/garlictech.angular-features.common.geosearch';
import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
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
  GenericUiModule,
  DeepstreamModule.forRoot(),
  AuthenticationApiModule.forRoot(getAuthConfig),
  SearchFiltersModule,
  SharedModule.forRoot(getSharedConfig),
  GeoSearchModule,
  HikeModule.forRoot(hikeModuleConfig),
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
  CurrentGeolocationModule.forRoot({ timeOut: 2000 }, { endpoint: environment.lambdaEndpoint }),
  LeafletMapModule,
  MarkerIconsModule,
  ToastModule
];
