import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DEEPSTREAM_REDUCER_TOKEN, DeepstreamSelectors, Effects, featureName, getReducers } from '../store';

@NgModule({
  imports: [StoreModule.forFeature(featureName, DEEPSTREAM_REDUCER_TOKEN), EffectsModule.forFeature([Effects])],
  providers: [
    Effects,
    {
      provide: DEEPSTREAM_REDUCER_TOKEN,
      useFactory: getReducers
    },
    DeepstreamSelectors
  ]
})
export class DeepstreamModule {}

export * from './externals';
