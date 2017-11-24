import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
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
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import {
  store,
  AuthEffects,
  AdminMapActions,
  RouteInfoDataActions,
  LayoutActions,
  RoutingActions,
  HikeEditRoutePlanningActions,
  HikeEditRoutePlanningEffects,
  HikeEditPoiActions,
  HikeEditPoiEffects
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
  PoiEditorService,
  WikipediaPoiService,
  OsmPoiService,
  OsmRoutePoiService,
  GooglePoiService,
  // Mocks
  HikeDataService
} from './shared/services';
// Global styles
import './styles';

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authentication.server;
authConfig.firebase = environment.firebase;
authConfig.webserverUrl = environment.webappServer;
authConfig.google.appId = environment.authentication.google.appId;

const commonConfig = new CommonConfig();

const appEffectsRun = [
  EffectsModule.run(AuthEffects),
  EffectsModule.run(HikeEditRoutePlanningEffects),
  EffectsModule.run(HikeEditPoiEffects)
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    JsonpModule,
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
    AngularFireModule.initializeApp(authConfig.firebase),
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
    // Services
    HikeDataService,
    AdminMapService,
    PoiEditorService,
    WikipediaPoiService,
    OsmPoiService,
    OsmRoutePoiService,
    GooglePoiService,
    // Actions
    AdminMapActions,
    RouteInfoDataActions,
    LayoutActions,
    RoutingActions,
    HikeEditRoutePlanningActions,
    HikeEditPoiActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
