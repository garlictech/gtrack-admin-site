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
  AuthenticationApiConfig, AuthenticationApiModule,
  Actions as JwtActions
} from 'subrepos/authentication-api-ngx';
import {
  SharedModule, SharedConfig, DeepstreamModule, RouterEffects, PoiEffects, HikeEffects, AuthenticationComponentsModule,
  AuthenticationModule as CommonAuthenticationModule,
  DynamicModalModule, DynamicModalService,
  PoiSelectors, HikeModuleConfig, HikeModule, RouteEffects,
  GeoSearchModule, GeoSearchEffects
} from 'subrepos/gtrack-common-ngx';
// App
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import {
  store, AuthEffects, HikeEditEffects, HikeEditRoutePlannerEffects, HikeEditPoiEffects
} from './store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditGeneralInfoSelectors,
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
  PoiEditorService, WikipediaPoiService, OsmPoiService, OsmRoutePoiService, GooglePoiService,
  HikeDataService, ReverseGeocodingService
} from './shared/services';
// Vendor
import { AngularFireModule } from 'angularfire2';
import { ToasterModule, ToasterService } from 'angular2-toaster';
// Global styles
import './styles';

const hikeModuleConfig = new HikeModuleConfig();
hikeModuleConfig.storeDomains = {
  hike: 'hike',
  poi: 'poi',
  route: 'route'
};

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authentication.server;
authConfig.firebase = environment.firebase;
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
      maxAge: 5
    }),
    DeepstreamModule.forRoot({
      deepstreamConnectionString: environment.deepstream,
      storeDomain: 'deepstream'
    }),
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
      HikeEditRoutePlannerEffects,
      HikeEditPoiEffects,
      RouterEffects,
      // Common-ngx
      PoiEffects,
      HikeEffects,
      RouteEffects,
      GeoSearchEffects
    ]),
    // Vendor
    ToasterModule.forRoot()
  ],
  providers: [
    // Services
    HikeDataService,
    ReverseGeocodingService,
    AdminMapService,
    PoiEditorService,
    WikipediaPoiService,
    OsmPoiService,
    OsmRoutePoiService,
    GooglePoiService,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
