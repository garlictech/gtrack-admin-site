import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeepstreamModule as CommonDeepstreamModule } from '@features/common/deepstream-ngx';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { FormModule } from './forms';
import { LanguageModule } from './language';

import {
  AuthenticationModule as CommonAuthenticationModule,
  DeepstreamModule,
  GtrackCommonModule,
  SearchFiltersModule,
  SharedModule
} from 'subrepos/gtrack-common-ngx';

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
    CommonAuthenticationModule
  ],
  declarations: [],
  exports: [LanguageModule]
})
export class GtrackCommonWebModule {}
