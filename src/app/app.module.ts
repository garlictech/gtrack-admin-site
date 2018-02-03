import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import {
  AuthenticationApiConfig,
  AuthenticationApiModule,
  Actions as JwtActions
} from 'subrepos/authentication-api-ngx';
import { SharedModule, SharedConfig, DeepstreamModule, RouterEffects } from 'subrepos/gtrack-common-ngx';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { store, AuthEffects, HikeEditRoutePlanningEffects, HikeEditPoiEffects, HikeEditPoiSelectors, HikeEditMapSelectors } from './store';
import { routing } from './app-routing.module';
// Modules
import { DynamicModalModule, DynamicModalService } from 'app/dynamic-modal';
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
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

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
    // Page modules
    CoreLayoutModule,
    AuthModule,
    HikeListModule,
    HikeEditModule,
    // Effects
    EffectsModule.forRoot([
      AuthEffects,
      HikeEditRoutePlanningEffects,
      HikeEditPoiEffects,
      RouterEffects
    ])
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
    HikeEditPoiSelectors,
    HikeEditMapSelectors,
    {
      provide: RouterStateSerializer,
      useClass: CustomRouterStateSerializer
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
