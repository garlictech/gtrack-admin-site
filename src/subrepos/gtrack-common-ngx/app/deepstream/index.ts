import { NgModule, ModuleWithProviders } from '@angular/core';
import _get from 'lodash-es/get';
import { createSelector } from '@ngrx/store';

import { IExternalDeepstreamDependencies, EXTERNAL_DEEPSTREAM_DEPENDENCIES } from '../../../deepstream-ngx';

import { environment } from 'environments/environment';
import { selectRole, selectUser } from '../authentication/store/selectors';

export const userIdSelector = createSelector(
  selectUser,
  state => _get(state, 'id')
);

export function externalDeepstreamDependencies(): IExternalDeepstreamDependencies {
  return {
    deepstreamConnectionString: environment.deepstream,
    storeDomain: 'deepstream',
    selectors: { getUserId: userIdSelector, getUserRole: selectRole }
  };
}

@NgModule()
export class DeepstreamModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DeepstreamModule,
      providers: [{ provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES, useFactory: externalDeepstreamDependencies }]
    };
  }
}

export {
  Reducer as DeepstreamReducer,
  IDeepstreamState,
  Actions as DeepstreamActions,
  DeepstreamService,
  Selectors
} from '../../../deepstream-ngx';
