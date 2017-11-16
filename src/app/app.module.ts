import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
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
import {
  store,
  AuthEffects,
  AdminMapActions,
  RouteInfoDataActions,
  RouteInfoDataEffects,
  LayoutActions,
  RoutingActions,
  HikeEditRoutePlanningActions,
  HikeEditRoutePlanningEffects
} from './store';
import { routing } from './app-routing.module';
// Page modules
import { CoreLayoutModule } from './core';
import { AuthModule } from './auth';
import { HikeListModule } from './pages/hike-list';
import { HikeEditModule } from './pages/hike-edit';
// Services
import {
  AdminMapService,
  OsmPoiService,
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

const appEffectsRun = [
  EffectsModule.run(AuthEffects),
  EffectsModule.run(RouteInfoDataEffects),
  EffectsModule.run(HikeEditRoutePlanningEffects)
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
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
    // Page modules
    CoreLayoutModule,
    AuthModule,
    HikeListModule,
    HikeEditModule,
    // Effects
    ...appEffectsRun
  ],
  providers: [
    HikeDataService,
    AdminMapService,
    AdminMapActions,
    RouteInfoDataActions,
    LayoutActions,
    RoutingActions,
    HikeEditRoutePlanningActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
