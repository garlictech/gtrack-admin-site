import { AngularSvgIconModule } from 'angular-svg-icon';

import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { MarkerIconsService } from './services';
import { markerIconsReducer } from './store';
import { featureName } from './store/state';

// tslint:disable:only-arrow-functions
export function _init(_markerIconsService: MarkerIconsService): () => void {
  return function(): void {
    _markerIconsService.init();
  };
}

@NgModule({
  imports: [CommonModule, AngularSvgIconModule, StoreModule.forFeature(featureName, markerIconsReducer)]
})
export class MarkerIconsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MarkerIconsModule,
      providers: [{ provide: APP_INITIALIZER, useFactory: _init, deps: [MarkerIconsService], multi: true }]
    };
  }
}
