import { NgModule, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { BackgroundGeolocationService } from './provider';
import { BackgroundGeolocationEffects } from './store/effects';
import { BACKGROUND_GEOLOCATION_CONFIG_TOKEN } from './config';

@NgModule({
  imports: [EffectsModule.forFeature([BackgroundGeolocationEffects])]
})
export class BackgroundGeolocationModule {
  static forRoot(config = { debug: false }): ModuleWithProviders {
    return {
      ngModule: BackgroundGeolocationModule,
      providers: [
        BackgroundGeolocationService,
        BackgroundGeolocationEffects, // Geolocation,
        { provide: BACKGROUND_GEOLOCATION_CONFIG_TOKEN, useValue: config }
      ]
    };
  }
}
