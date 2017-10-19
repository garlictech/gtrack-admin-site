import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import {
  AuthenticationApiConfig,
  AuthenticationApiModule
} from '../subrepos/authentication-api-ngx';
import { CommonModule as GtCommonModule, CommonConfig } from '../subrepos/gtrack-common-ngx';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { store, Effects } from './store';
import { routing } from './app-routing.module';
// Components
import { LayoutComponent } from './core/components/layout';
import { FooterComponent } from './core/components/footer';
import { NavbarComponent } from './core/components/navbar';
import { SidebarComponent } from './core/components/sidebar';
import { PageNotFoundComponent } from './core/components/page-not-found';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import { HikeEditComponent } from './pages/hike-edit';
// Pipes
import { ObjectToArrayPipe } from './shared/pipes/';
// Mocks
import { HikeDataService } from './shared/services';
// Services
import { WaypointMarkerService } from './shared/services';
import { RoutingControlService } from './shared/services';
// Global styles
import './styles';
// Vendors
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../../node_modules/bootstrap-material-design/dist/js/material.min.js';

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authentication.server;
authConfig.firebase = environment.firebase;
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
    AngularFireModule.initializeApp(authConfig.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AuthenticationApiModule.forRoot(authConfig),
    GtCommonModule.forRoot(commonConfig),
    RouterStoreModule.connectRouter(),
    EffectsModule.run(Effects)
  ],
  providers: [
    HikeDataService,
    WaypointMarkerService,
    RoutingControlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
