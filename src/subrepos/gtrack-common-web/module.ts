import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { DeepstreamModule as CommonDeepstreamModule } from 'subrepos/deepstream-ngx';

import {
  GtrackCommonModule,
  SearchFiltersModule,
  DeepstreamModule,
  AuthenticationModule as CommonAuthenticationModule,
  SharedModule,
  BackgroundGeolocationModule
} from 'subrepos/gtrack-common-ngx';

import { FormModule } from './forms';
import { LanguageModule } from './language';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    LanguageModule,
    StoreRouterConnectingModule,
    CommonDeepstreamModule,
    GtrackCommonModule,
    DeepstreamModule,
    SearchFiltersModule,
    SharedModule,
    BackgroundGeolocationModule,
    CommonAuthenticationModule
  ],
  declarations: [],
  exports: [LanguageModule]
})
export class GtrackCommonWebModule {}
