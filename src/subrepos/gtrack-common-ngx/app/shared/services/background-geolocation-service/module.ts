import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { BackgroundGeolocationService } from './provider';
import { Config } from './config';
// import { Geolocation } from '@ionic-native/geolocation';

@NgModule()
export class BackgroundGeolocationModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: BackgroundGeolocationModule,
      providers: [
        BackgroundGeolocationService,
        // Geolocation,
        { provide: Config, useValue: config || new Config() },
        {
          provide: APP_INITIALIZER,
          useFactory: (bgl: BackgroundGeolocationService) => () => bgl.init(),
          deps: [BackgroundGeolocationService],
          multi: true
        }
      ]
    };
  }
}
