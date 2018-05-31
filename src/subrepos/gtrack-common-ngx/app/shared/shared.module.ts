import { NgModule, ModuleWithProviders } from '@angular/core';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';

import { SharedConfig } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe } from './pipes';

@NgModule({
  imports: [],
  exports: [DistancePipe, DurationPipe, CoordinatePipe],
  declarations: [DistancePipe, DurationPipe, CoordinatePipe],
  providers: [UnitsService, GoogleMapsService]
})
export class SharedModule {
  static forRoot(config: SharedConfig): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: SharedConfig,
          useValue: config
        }
      ]
    };
  }
}

export { DistancePipe, DurationPipe, CoordinatePipe, UnitsService, GoogleMapsService, SharedConfig };
