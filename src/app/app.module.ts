import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AuthenticationApiConfig, AuthenticationApiModule } from 'authentication-api-ngx';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { store } from './store';

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authServer;
authConfig.firebase = environment.firebase;
authConfig.webserverUrl = environment.webappServer;
authConfig.google.appId = environment.google.appId;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    store,
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 25
    }),
    AngularFireModule.initializeApp(authConfig.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AuthenticationApiModule.forRoot(authConfig)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
