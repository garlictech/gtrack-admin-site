import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { PopupComponent } from './components';
import { featureName, getReducers, POPUP_REDUCER_TOKEN } from './store';

@NgModule({
  declarations: [PopupComponent],
  imports: [CommonModule, StoreModule.forFeature(featureName, POPUP_REDUCER_TOKEN)],
  exports: [PopupComponent],
  providers: [
    {
      provide: POPUP_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ]
})
export class PopupModule {}
