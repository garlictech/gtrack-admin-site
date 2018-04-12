import './styles/styles.scss';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterStateSnapshot, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
// NgRx
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
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
  GeoSearchEffects
} from 'subrepos/gtrack-common-ngx';

import { LanguageModule } from './language';

// App
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthEffects, HikeEditEffects, HikeEditPoiEffects, HikeProgramEffects } from './store/effects';

import { store } from './store';

import {
  HikeEditPoiSelectors,
  HikeEditMapSelectors,
  HikeEditGeneralInfoSelectors,
  HikeEditRoutePlannerSelectors
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
  HikeDataService,
  ReverseGeocodingService,
  LanguageService
} from './shared/services';
// Vendor
import { AngularFireModule } from 'angularfire2';
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { RoutePlannerService, RoutingControlService } from './shared/services/admin-map';
import { WaypointMarkerService } from './shared/services/admin-map/waypoint-marker.service';

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
    // Page modules
    CoreLayoutModule,
    AuthModule,
    HikeListModule,
    HikeEditModule,
    // Effects
    EffectsModule.forRoot([
      AuthEffects,
      HikeEditEffects,
      HikeEditPoiEffects,
      RouteEffects,
      // Common-ngx
      PoiEffects,
      HikeEffects,
      GeoSearchEffects,
      HikeProgramEffects
    ]),
    // Vendor
    ToasterModule.forRoot(),
    LanguageModule
  ],
  providers: [
    // Services
    HikeDataService,
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
    // Selectors
    HikeEditGeneralInfoSelectors,
    HikeEditPoiSelectors,
    HikeEditMapSelectors,
    HikeEditRoutePlannerSelectors,
    PoiSelectors,
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializer
    },
    // Lib
    ToasterService
  ],
  bootstrap: [AppComponent],
  exports: [LanguageModule]
})
export class AppModule {}
