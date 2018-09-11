import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from 'environments/environment';

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
import { GenericComponentsModule } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    LanguageModule,
    GenericComponentsModule,
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
  exports: [GenericComponentsModule, LanguageModule]
})
export class GtrackCommonWebModule {}
