import { NgModule } from '@angular/core';

import { DeepstreamService } from '../deepstream-service';
import { DeepstreamService as ServerService } from '../deepstream-service-server';
import { DeepstreamSelectors } from '../store';

@NgModule({
  imports: [],
  providers: [
    {
      provide: DeepstreamService,
      useClass: ServerService
    },
    DeepstreamSelectors
  ]
})
export class DeepstreamModule {}

export * from './externals';
