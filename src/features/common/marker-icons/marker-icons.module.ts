import { AngularSvgIconModule } from 'angular-svg-icon';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { markerIconsReducer } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [CommonModule, AngularSvgIconModule, StoreModule.forFeature(featureName, markerIconsReducer)]
})
export class MarkerIconsModule {}
