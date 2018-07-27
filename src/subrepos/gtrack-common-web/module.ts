import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Raven from 'raven-js';
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
import { log } from 'app/log';

if (process.env.ENV !== 'development') {
  Raven.config(environment.raven).install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    log.er(err);

    if (process.env.ENV !== 'development') {
      Raven.captureException(err);
    }
  }
}

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
  providers: [{ provide: ErrorHandler, useClass: RavenErrorHandler }],
  exports: [GenericComponentsModule, LanguageModule]
})
export class GtrackCommonWebModule {}
