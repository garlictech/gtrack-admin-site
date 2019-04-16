import {
  AuthenticationModule as CommonAuthenticationModule,
  DeepstreamModule,
  GtrackCommonModule,
  SharedModule
} from 'subrepos/gtrack-common-ngx';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeepstreamModule as CommonDeepstreamModule } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { FormModule } from '@features/web/forms-primeng';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { LanguageModule } from '@features/web/language';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    LanguageModule,
    StoreRouterConnectingModule,
    CommonDeepstreamModule,
    GtrackCommonModule,
    DeepstreamModule,
    SharedModule,
    CommonAuthenticationModule
  ],
  declarations: [],
  exports: [LanguageModule]
})
export class GtrackCommonWebModule {}
