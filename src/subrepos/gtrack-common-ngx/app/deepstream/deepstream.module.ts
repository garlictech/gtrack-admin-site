import { NgModule, ModuleWithProviders } from '@angular/core';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { IAuthenticationState, IAuth, Actions as JwtActions } from 'subrepos/authentication-api-ngx';

import {
  DeepstreamModule as CoreDeepstreamModule,
  IExternalDeepstreamDependencies,
  EXTERNAL_DEEPSTREAM_DEPENDENCIES
} from 'subrepos/deepstream-ngx';

import { IDeepstreamModuleConfig } from './interfaces';

let selectAuthFeature = createFeatureSelector<IAuthenticationState>('authentication');
let selectAuth = createSelector(selectAuthFeature, (state: IAuthenticationState) => state.auth);

export const selectUser = createSelector(selectAuth, (state: IAuth) => state.user);

let defaultExternalDeepstreamDependencies: IExternalDeepstreamDependencies = {
  JwtApiActions: {
    LOGIN_SUCCESS: JwtActions.LOGIN_SUCCESS,
    LOGOUT_START: JwtActions.LOGOUT_START
  },
  deepstreamConnectionString: 'wss://deepstream.gtracksport.com/deepstream',
  selectors: {
    getUserId: createSelector(selectUser, state => _.get(state, 'id')),
    getUserRole: createSelector(selectUser, state => _.get(state, 'roles[0]'))
  },
  storeDomain: 'deepstream'
};

@NgModule({
  imports: [CoreDeepstreamModule]
})
export class DeepstreamModule {
  static forRoot(externalDeepstreamDependencies: IDeepstreamModuleConfig): ModuleWithProviders {
    return {
      ngModule: DeepstreamModule,
      providers: [
        {
          provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES,
          useValue: _.merge(defaultExternalDeepstreamDependencies, externalDeepstreamDependencies)
        }
      ]
    }
  }
}

export { Reducer, IDeepstreamState, DeepstreamService } from 'subrepos/deepstream-ngx';
