import { NgModule, ModuleWithProviders } from '@angular/core';
import { BackgroundGeolocationService } from './provider';
import { BackgroundGeolocationEffects } from './store/effects';
import { BackgroundGeolocationServiceConfig } from './config';

@NgModule()
export class BackgroundGeolocationModule {
  static forRoot(config = new BackgroundGeolocationServiceConfig()): ModuleWithProviders {
    return {
      ngModule: BackgroundGeolocationModule,
      providers: [
        BackgroundGeolocationService,
        BackgroundGeolocationEffects,
        // Geolocation,
        {
          provide: BackgroundGeolocationServiceConfig,
          useValue: config
        }
      ]
    };
  }
}
