import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Raven from 'raven-js';

// App
import { AppComponent } from './app.component';
import { environment } from 'environments/environment';

import { APP_DECLARATIONS } from './app.declarations';
import { APP_ENTRY_COMPONENTS } from './app.entry-components';
import { APP_IMPORTS } from './app.imports';
import { APP_PROVIDERS } from './app.providers';

import { AppRoutingModule } from './app-routing.module';
import { ConfirmDialogModule } from 'primeng/primeng';

if (process.env.ENV !== 'development') {
  Raven.config(environment.raven).install();
}

console.log('ENVIRONMENT: ', process.env, environment);

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);

    if (process.env.ENV !== 'development') {
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
    AppRoutingModule,
    ConfirmDialogModule
  ],
  providers: [...APP_PROVIDERS, { provide: ErrorHandler, useClass: RavenErrorHandler }],
  bootstrap: [AppComponent],
  entryComponents: [APP_ENTRY_COMPONENTS]
})
export class AppModule {}
