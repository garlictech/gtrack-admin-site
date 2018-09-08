import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { environment } from 'environments/environment';

import { APP_DECLARATIONS } from './app.declarations';
import { APP_ENTRY_COMPONENTS } from './app.entry-components';
import { APP_IMPORTS } from './app.imports';
import { APP_PROVIDERS } from './app.providers';

import { AppRoutingModule } from './app-routing.module';
import { ConfirmDialogModule } from 'primeng/primeng';

@NgModule({
  declarations: [AppComponent, APP_DECLARATIONS],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'gtrack-admin' }),
    APP_IMPORTS,
    AppRoutingModule,
    ConfirmDialogModule
  ],
  providers: [...APP_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [APP_ENTRY_COMPONENTS]
})
export class AppModule {}
