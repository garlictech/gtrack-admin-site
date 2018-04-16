import { NgModule, ModuleWithProviders } from '@angular/core';
import { BackgroundGeolocationService } from './provider';
import { BackgroundGeolocationEffects } from './store/effects';
import { Config } from './config';

@NgModule()
export class BackgroundGeolocationModule {
  static forRoot(config = new Config()): ModuleWithProviders {
    return {
      ngModule: BackgroundGeolocationModule,
      providers: [
        BackgroundGeolocationService,
        BackgroundGeolocationEffects,
        // Geolocation,
        {
          provide: Config,
          useValue: config
        }
      ]
    };
  }
}
