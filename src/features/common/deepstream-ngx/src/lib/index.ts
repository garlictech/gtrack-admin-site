import { environment } from 'environments/environment';
import _get from 'lodash-es/get';

import { NgModule } from '@angular/core';
import { selectRole, selectUser } from '@features/common/authentication/store/selectors';
import { EffectsModule } from '@ngrx/effects';
import { createSelector } from '@ngrx/store';

import { DeepstreamService } from '../deepstream-service';
import { Effects, Selectors } from '../store';
import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, ExternalDeepstreamDependencies } from './externals';

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

@NgModule({
  imports: [EffectsModule.forFeature([Effects])],
  providers: [
    Effects,
    DeepstreamService,
    Selectors,
    {
      provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES,
      useFactory: externalDeepstreamDependencies
    }
  ]
})
export class DeepstreamModule {}

export * from './externals';
