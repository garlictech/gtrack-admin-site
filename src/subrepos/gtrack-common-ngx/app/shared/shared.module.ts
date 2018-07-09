import { NgModule, ModuleWithProviders } from '@angular/core';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';
import { GeospatialService } from './services/geospatial';

import { ISharedConfig, SHARED_CONFIG_TOKEN } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe } from './pipes';

@NgModule({
  imports: [],
  exports: [DistancePipe, DurationPipe, CoordinatePipe],
  declarations: [DistancePipe, DurationPipe, CoordinatePipe],
  providers: [UnitsService, GoogleMapsService, GeospatialService]
})
export class SharedModule {
  static forRoot(config: ISharedConfig): ModuleWithProviders {
    return { ngModule: SharedModule, providers: [{ provide: SHARED_CONFIG_TOKEN, useValue: config }] };
  }
}

export { DistancePipe, DurationPipe, CoordinatePipe, UnitsService, GoogleMapsService, ISharedConfig, GeospatialService };
