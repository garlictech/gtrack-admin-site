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

import { environment } from 'environments/environment';
import { selectRole, selectUser } from '../authentication/store/selectors';

export const userIdSelector = createSelector(selectUser, state => _.get(state, 'id'));

export function externalDeepstreamDependencies(): IExternalDeepstreamDependencies {
  return {
    deepstreamConnectionString: environment.deepstream,
    storeDomain: 'deepstream',
    selectors: { getUserId: userIdSelector, getUserRole: selectRole }
  };
}

@NgModule({ imports: [CoreDeepstreamModule] })
export class DeepstreamModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DeepstreamModule,
      providers: [
        DeepstreamService,
        Selectors,
        { provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES, useFactory: externalDeepstreamDependencies }
      ]
    };
  }
}

export { DeepstreamService, Selectors };
export { Reducer as DeepstreamReducer, IDeepstreamState, Actions as DeepstreamActions } from 'subrepos/deepstream-ngx';
