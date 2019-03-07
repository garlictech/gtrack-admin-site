import { ModuleWithProviders, NgModule } from '@angular/core';
import { createSelector } from '@ngrx/store';
import _get from 'lodash-es/get';

import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, ExternalDeepstreamDependencies } from '@features/common/deepstream-ngx';

import { environment } from 'environments/environment';
import { selectRole, selectUser } from '../authentication/store/selectors';

export const userIdSelector = createSelector(
  selectUser,
  state => _get(state, 'id')
);

// tslint:disable-next-line:only-arrow-functions
export function externalDeepstreamDependencies(): ExternalDeepstreamDependencies {
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
  DeepstreamState,
  Actions as DeepstreamActions,
  DeepstreamService,
  Selectors
} from '@features/common/deepstream-ngx';
