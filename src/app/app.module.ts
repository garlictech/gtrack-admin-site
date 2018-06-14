import './styles/styles.scss';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterStateSnapshot, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import * as Raven from 'raven-js';

import {
  SharedModule,
  DeepstreamModule,
  RouteEffects,
  PoiEffects,
  HikeEffects,
  AuthenticationModule as CommonAuthenticationModule,
  DynamicModalModule,
  HikeModule,
  GeoSearchModule,
  GeoSearchEffects,
  BackgroundGeolocationEffects,
  BackgroundGeolocationModule
} from 'subrepos/gtrack-common-ngx';

import { LanguageModule } from './language';

// App
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import {
  AuthEffects,
  HikeEditPoiEffects,
  EditedHikeProgramEffects,
  EditedGTrackPoiEffects,
  HikeEditImageEffects
} from './store/effects';

import { APP_DECLARATIONS } from './app.declarations';
import { APP_ENTRY_COMPONENTS } from './app.entry-components';
import { APP_IMPORTS } from './app.imports';
import { APP_PROVIDERS } from './app.providers';

import { AppRoutingModule } from './app-routing.module';

if (process.env.NODE_ENV !== 'development') {
  Raven.config(environment.raven).install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);

    if (process.env.NODE_ENV !== 'development') {
      Raven.captureException(err);
    }
  }
}

@NgModule({
  declarations: [AppComponent, APP_DECLARATIONS],
  imports: [
    CommonModule,
    BrowserModule,
    DEV_SERVER ? [BrowserAnimationsModule, BrowserTransferStateModule] : [],
    APP_IMPORTS,
    AppRoutingModule
  ],
  providers: [...APP_PROVIDERS, { provide: ErrorHandler, useClass: RavenErrorHandler }],
  bootstrap: [AppComponent],
  entryComponents: [APP_ENTRY_COMPONENTS]
})
export class AppModule {}
