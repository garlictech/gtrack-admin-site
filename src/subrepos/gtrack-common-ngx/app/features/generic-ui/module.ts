import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { Effects } from './store/effects';
import { LoaderWatchService } from './services';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  imports: [EffectsModule.forFeature([Effects]), StoreModule.forFeature(featureName, reducer)],
  providers: [Effects, LoaderWatchService]
})
export class GenericUiModule {}
