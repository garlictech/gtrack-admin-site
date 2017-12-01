import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { Effects } from '../store';
import { DeepstreamService } from '../deepstream-service';

@NgModule({
  imports: [EffectsModule.forFeature([Effects])],
  providers: [Effects, DeepstreamService]
})
export class DeepstreamModule {}

export * from './externals';
