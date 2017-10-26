import { NgModule, ModuleWithProviders } from '@angular/core';

import {
  DeepstreamModule as CoreDeepstreamModule,
  IExternalDeepstreamDependencies,
  EXTERNAL_DEEPSTREAM_DEPENDENCIES
} from '../../subrepos/deepstream-ngx';

@NgModule({
  imports: [CoreDeepstreamModule]
})
export class DeepstreamModule {
  static forRoot(externalDeepstreamDependencies: IExternalDeepstreamDependencies): ModuleWithProviders {
    return {
      ngModule: DeepstreamModule,
      providers: [
        {
          provide: EXTERNAL_DEEPSTREAM_DEPENDENCIES,
          useValue: externalDeepstreamDependencies
        }
      ]
    }
  }
}

export { Reducer, IDeepstreamState, DeepstreamService } from '../../subrepos/deepstream-ngx';
