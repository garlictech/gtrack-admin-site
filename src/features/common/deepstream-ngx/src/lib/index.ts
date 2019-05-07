import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DeepstreamSelectors, Effects, featureName } from '../store';
import { reducer } from '../store/reducer';

@NgModule({
  imports: [StoreModule.forFeature(featureName, reducer), EffectsModule.forFeature([Effects])],
  providers: [Effects, DeepstreamSelectors]
})
export class DeepstreamModule {}

export * from './externals';
