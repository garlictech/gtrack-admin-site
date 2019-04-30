import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { PopupComponent } from './components';
import { featureName, Reducer } from './store';

@NgModule({
  declarations: [PopupComponent],
  imports: [CommonModule, StoreModule.forFeature(featureName, Reducer)],
  exports: [PopupComponent]
})
export class PopupModule {}
