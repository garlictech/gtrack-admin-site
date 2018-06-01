import './styles/styles.scss';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { RouterStateSnapshot, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
// NgRx
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import * as Raven from 'raven-js';
// Subrepos
import {
  AuthenticationApiConfig,
  AuthenticationApiModule,
  Actions as JwtActions
} from 'subrepos/authentication-api-ngx';
import {
  SharedModule,
  SharedConfig,
  DeepstreamModule,
  RouteEffects,
  PoiEffects,
  HikeEffects,
  AuthenticationModule as CommonAuthenticationModule,
  DynamicModalModule,
  DynamicModalService,
  PoiSelectors,
  HikeModuleConfig,
  HikeModule,
  GeoSearchModule,
  GeoSearchEffects,
  SearchFiltersModule,
  BackgroundGeolocationEffects,
  BackgroundGeolocationModule
} from 'subrepos/gtrack-common-ngx';

import { LanguageModule } from './language';

// App
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthEffects, HikeEditPoiEffects, EditedHikeProgramEffects, EditedGTrackPoiEffects, HikeEditImageEffects } from './store/effects';

import { store } from './store';

import {
  EditedGTrackPoiSelectors,
  EditedHikeProgramSelectors,
  HikeEditPoiSelectors,
  HikeEditMapSelectors,
  HikeEditRoutePlannerSelectors,
  HikeEditImageSelectors
} from './store/selectors';
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
  ReverseGeocodingService,
  LanguageService,
  HikeProgramService,
  MapillaryService
} from './shared/services';
// Vendor
import { AngularFireModule } from 'angularfire2';
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { RoutePlannerService, RoutingControlService } from './shared/services/admin-map';
import { WaypointMarkerService } from './shared/services/admin-map/waypoint-marker.service';

console.log('ENVIRONMENT: ', process.env, environment);

if (process.env.NODE_ENV !== 'development') {
  Raven.config(environment.raven).install();
}

const hikeModuleConfig = new HikeModuleConfig();
hikeModuleConfig.storeDomains = {
  hike: 'hike',
  poi: 'poi',
  route: 'route'
};

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authentication.server;
authConfig.webserverUrl = environment.webappServer;
authConfig.google.appId = environment.authentication.google.appId;

const sharedConfig = new SharedConfig();

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    const params = route.params;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
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
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CommonAuthenticationModule,
    HttpClientModule,
    JsonpModule,
    store,
    routing,
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    DeepstreamModule.forRoot(),
    AngularFireModule.initializeApp(authConfig.firebase),
    AuthenticationApiModule.forRoot(authConfig),
    SharedModule.forRoot(sharedConfig),
    // Modules
    DynamicModalModule,
    HikeModule.forRoot(hikeModuleConfig),
    GeoSearchModule.forRoot({
      storeDomain: 'geosearch'
    }),
    SearchFiltersModule.forRoot({
      storeDomain: 'searchFilters'
    }),
    BackgroundGeolocationModule.forRoot(),
    // Page modules
    CoreLayoutModule,
    AuthModule,
    HikeListModule,
    HikeEditModule,
    // Effects
    EffectsModule.forRoot([
      AuthEffects,
      HikeEditPoiEffects,
      RouteEffects,
      EditedHikeProgramEffects,
      EditedGTrackPoiEffects,
      HikeEditImageEffects,
      // Common-ngx
      PoiEffects,
      HikeEffects,
      GeoSearchEffects,
      BackgroundGeolocationEffects
    ]),
    // Vendor
    ToasterModule.forRoot(),
    LanguageModule
  ],
  providers: [
    // Services
    ReverseGeocodingService,
    AdminMapService,
    RoutePlannerService,
    RoutingControlService,
    WaypointMarkerService,
    PoiEditorService,
    WikipediaPoiService,
    OsmPoiService,
    OsmRoutePoiService,
    GooglePoiService,
    LanguageService,
    HikeProgramService,
    MapillaryService,
    // Selectors
    EditedGTrackPoiSelectors,
    EditedHikeProgramSelectors,
    HikeEditPoiSelectors,
    HikeEditImageSelectors,
    HikeEditMapSelectors,
    HikeEditRoutePlannerSelectors,
    PoiSelectors,
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializer
    },
    { provide: ErrorHandler, useClass: RavenErrorHandler },
    // Lib
    ToasterService
  ],
  bootstrap: [AppComponent],
  exports: [LanguageModule]
})
export class AppModule {}
