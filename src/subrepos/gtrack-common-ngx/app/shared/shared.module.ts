import { NgModule, ModuleWithProviders } from '@angular/core';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';
import { GeospatialService } from './services/geospatial';

import { ISharedConfig, SHARED_CONFIG_TOKEN } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe } from './pipes';
import { SanitizeHtmlDirective } from './directives/sanitize-html';

@NgModule({
  imports: [],
  declarations: [DistancePipe, DurationPipe, CoordinatePipe, SanitizeHtmlDirective],
  providers: [UnitsService, GoogleMapsService, GeospatialService],
  exports: [DistancePipe, DurationPipe, CoordinatePipe, SanitizeHtmlDirective]
})
export class SharedModule {
  static forRoot(config: ISharedConfig): ModuleWithProviders {
    return { ngModule: SharedModule, providers: [{ provide: SHARED_CONFIG_TOKEN, useValue: config }] };
  }
}

export {
  DistancePipe,
  DurationPipe,
  CoordinatePipe,
  UnitsService,
  GoogleMapsService,
  ISharedConfig,
  GeospatialService
};
