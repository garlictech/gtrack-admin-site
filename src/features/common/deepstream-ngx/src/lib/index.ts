import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { DeepstreamService } from '../deepstream-service';
import { Effects, Selectors } from '../store';

@NgModule({
  imports: [EffectsModule.forFeature([Effects])],
  providers: [Effects, DeepstreamService, Selectors]
})
export class DeepstreamModule {}

export * from './externals';
