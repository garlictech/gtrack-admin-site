import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoaderWatchService } from './services';
import { Effects } from './store/effects';
import { reducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  imports: [EffectsModule.forFeature([Effects]), StoreModule.forFeature(featureName, reducer)],
  providers: [Effects, LoaderWatchService]
})
export class GenericUiModule {}
