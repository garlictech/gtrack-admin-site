import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SlideShowComponent } from './components';
import { LoaderWatchService } from './services';
import { Effects } from './store/effects';
import { reducer } from './store/reducer';
import { featureName } from './store/state';

@NgModule({
  declarations: [SlideShowComponent],
  exports: [SlideShowComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer)
  ],
  providers: [Effects, LoaderWatchService]
})
export class GenericUiModule {}
