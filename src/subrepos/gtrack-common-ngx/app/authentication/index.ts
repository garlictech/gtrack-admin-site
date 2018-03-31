import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { AuthenticationApiConfig, AuthenticationApiModule } from 'subrepos/authentication-api-ngx';
import { DeepstreamModule, DeepstreamActions } from '../deepstream';

import { environment } from 'environments/environment';
import { DebugLog, log } from 'app/log';
import { State } from 'app/store';

import { AuthenticationSelectors } from './store';
import { NotAuthGuard } from './guards';

const config = new AuthenticationApiConfig();
config.apiUrl = environment.authentication.server;
config.webserverUrl = environment.webappServer;
config.facebook.appId = _.get(environment, 'authentication.facebook.appId');
config.google.appId = _.get(environment, 'authentication.google.appId');
config.magiclink = { redirectSlug: '/auth/magiclink' };

@NgModule({
  imports: [DeepstreamModule.forRoot(), AuthenticationApiModule.forRoot(config)],
  providers: [AuthenticationSelectors.Selectors, NotAuthGuard]
})
export class AuthenticationModule {}

export * from './store/';
export { AuthenticationActions } from './store';
export { EAuthRoles } from 'subrepos/provider-client';
export { NotAuthGuard, AuthenticationSelectors };
export { User, ApiService, PasswordlessSuccessComponent } from 'subrepos/authentication-api-ngx';
