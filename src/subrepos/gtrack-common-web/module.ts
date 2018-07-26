import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Raven from 'raven-js';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from 'environments/environment';

import { DeepstreamModule as CommonDeepstreamModule } from 'subrepos/deepstream-ngx';

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
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
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
  exports: []
})
export class GtrackCommonWebModule {}
