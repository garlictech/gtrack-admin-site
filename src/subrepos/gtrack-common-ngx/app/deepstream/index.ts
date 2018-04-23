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
    console.log(externalDeepstreamDependencies);
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
export { Reducer, IDeepstreamState, Actions as DeepstreamActions } from 'subrepos/deepstream-ngx';
