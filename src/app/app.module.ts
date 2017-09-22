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
import { AuthenticationApiConfig, AuthenticationApiModule } from 'authentication-api-ngx';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { store, Effects } from './store';

import { routing } from './app-routing.module';
import { GtMaterialModule } from './material.module';

import { LayoutComponent } from './core/components/layout';
import { NavItemComponent } from './core/components/nav-item';
import { SidenavComponent } from './core/components/sidenav';
import { ToolbarComponent } from './core/components/toolbar';
import { PageNotFoundComponent } from './core/components/page-not-found';
import { LoginComponent } from './auth/components/login';
import { HikeListComponent } from './pages/hike-list';
import { HikeEditComponent } from './pages/hike-edit';

const authConfig = new AuthenticationApiConfig();
authConfig.apiUrl = environment.authServer;
authConfig.firebase = environment.firebase;
authConfig.webserverUrl = environment.webappServer;
authConfig.google.appId = environment.google.appId;

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        NavItemComponent,
        SidenavComponent,
        ToolbarComponent,
        LoginComponent,
        HikeListComponent,
        HikeEditComponent,
        PageNotFoundComponent
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
        GtMaterialModule,
        RouterStoreModule.connectRouter(),
        EffectsModule.run(Effects)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
