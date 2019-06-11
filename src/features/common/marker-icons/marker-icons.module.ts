import { AngularSvgIconModule } from 'angular-svg-icon';

import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { TrustedPipesModule } from '@bit/garlictech.angular-features.common.generic-ui/pipes/trusted-pipes';
import { StoreModule } from '@ngrx/store';

import { CircleIconComponent } from './components/circle-icon';
import { IconComponent } from './components/icon';
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
  imports: [
    CommonModule,
    AngularSvgIconModule,
    StoreModule.forFeature(featureName, markerIconsReducer),
    TrustedPipesModule
  ],
  declarations: [IconComponent, CircleIconComponent],
  exports: [IconComponent, CircleIconComponent]
})
export class MarkerIconsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MarkerIconsModule,
      providers: [{ provide: APP_INITIALIZER, useFactory: _init, deps: [MarkerIconsService], multi: true }]
    };
  }
}
