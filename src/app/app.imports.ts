import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToasterModule } from 'angular2-toaster';
import { EffectsModule } from '@ngrx/effects';

import { GtrackCommonModule, defaultSharedConfig, DynamicModalModule } from 'subrepos/gtrack-common-ngx';
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

const sharedConfig = { ...defaultSharedConfig };

export const APP_IMPORTS = [
  StoreModule.forRoot(REDUCER_TOKEN, {
    metaReducers
  }),
  StoreRouterConnectingModule,
  LanguageModule,
  GtrackCommonModule,
  StoreDevtoolsModule.instrument({
    maxAge: 25
  }),
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
  FormModule,
  DynamicModalModule
];
