import { NgModule } from '@angular/core';

import { DeepstreamService } from '../deepstream-service';
import { DeepstreamService as ServerService } from '../deepstream-service-server';
import { Selectors } from '../store';

@NgModule({
  imports: [],
  providers: [
    {
      provide: DeepstreamService,
      useClass: ServerService
    },
    Selectors
  ]
})
export class DeepstreamModule {}

export * from './externals';
