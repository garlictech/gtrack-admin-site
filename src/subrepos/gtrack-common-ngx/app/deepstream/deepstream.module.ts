import { NgModule, ModuleWithProviders } from '@angular/core';
import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';

import {
  DeepstreamModule as CoreDeepstreamModule,
  DeepstreamService,
  IExternalDeepstreamDependencies,
  EXTERNAL_DEEPSTREAM_DEPENDENCIES,
  Selectors
} from 'subrepos/deepstream-ngx';

import { IDeepstreamModuleConfig } from './interfaces';

let selectAuthFeature = createFeatureSelector<IAuthenticationState>('jwtAuthentication');
let selectAuth = createSelector(selectAuthFeature, (state: IAuthenticationState) => _.get(state, 'auth'));

let externalDeepstreamDependencies: IExternalDeepstreamDependencies = {
  deepstreamConnectionString: environment.deepstream,
  storeDomain: 'deepstream',
  selectors: {
    getUserId: createSelector(selectUser, state => _.get(state, 'id')),
    getUserRole: selectRole
  }
};

@NgModule({ imports: [CoreDeepstreamModule] })
export class DeepstreamModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DeepstreamModule,
      providers: [
        DeepstreamService,
        Selectors,
        { provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES, useValue: externalDeepstreamDependencies }
      ]
    };
  }
}

export { DeepstreamService, Selectors };
export { Reducer, IDeepstreamState, Actions } from 'subrepos/deepstream-ngx';
