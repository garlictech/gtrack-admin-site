import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import {
  AuthenticationApiConfig,
  AuthenticationApiModule,
  Actions as JwtActions
} from '../subrepos/authentication-api-ngx';
import {
  CommonModule as GtCommonModule,
  CommonConfig,
  DeepstreamModule
} from '../subrepos/gtrack-common-ngx';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { store, Effects, Actions } from './store';
import { routing } from './app-routing.module';
// Components
import { LayoutComponent } from './core/components/layout';
import { FooterComponent } from './core/components/footer';
import { NavbarComponent } from './core/components/navbar';
import { SidebarComponent } from './core/components/sidebar';
import { PageNotFoundComponent } from './core/components/page-not-found';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import {
  HikeEditComponent,
  HikeGeneralInfoComponent,
  HikeMapComponent,
  HikeRoutePlanningComponent
} from './pages/hike-edit';
import { AdminLeafletComponent } from './shared/components/admin-leaflet';
// Pipes
import { ObjectToArrayPipe } from './shared/pipes/';
// Services
import {
  AdminMapService,
  // Mocks
  HikeDataService
} from './shared/services';
// Global styles
import './styles';

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authentication.server;
authConfig.webserverUrl = environment.webappServer;
authConfig.google.appId = environment.authentication.google.appId;

const commonConfig = new CommonConfig();

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    HikeListComponent,
    HikeEditComponent,
    HikeGeneralInfoComponent,
    HikeMapComponent,
    HikeRoutePlanningComponent,
    AdminLeafletComponent,
    PageNotFoundComponent,
    // Pipes
    ObjectToArrayPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpModule,
    store,
    routing,
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 25
    }),
    DeepstreamModule.forRoot({
      JwtApiActions: {
        LOGIN_SUCCESS: JwtActions.LOGIN_SUCCESS,
        LOGOUT_START: JwtActions.LOGOUT_START
      },
      deepstreamConnectionString: 'localhost:6020'
    }),
    AuthenticationApiModule.forRoot(authConfig),
    GtCommonModule.forRoot(commonConfig),
    RouterStoreModule.connectRouter(),
    EffectsModule.run(Effects)
  ],
  providers: [
    HikeDataService,
    AdminMapService,
    Actions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
