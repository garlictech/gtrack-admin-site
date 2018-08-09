import { NgModule, ModuleWithProviders } from '@angular/core';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';
import { GeospatialService } from './services/geospatial';

import { ISharedConfig, SHARED_CONFIG_TOKEN } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe } from './pipes';
import { SanitizeHtmlDirective } from './directives/sanitize-html';
import { PoiImagesToGalleryPipe } from './pipes';
import { GeoIpService } from './services/geoip';

@NgModule({
  imports: [],
  declarations: [DistancePipe, DurationPipe, CoordinatePipe, SanitizeHtmlDirective, PoiImagesToGalleryPipe],
  providers: [UnitsService, GoogleMapsService, GeospatialService, GeoIpService],
  exports: [DistancePipe, DurationPipe, CoordinatePipe, SanitizeHtmlDirective, PoiImagesToGalleryPipe]
})
export class SharedModule {
  static forRoot(configFactory: any): ModuleWithProviders {
    return { ngModule: SharedModule, providers: [{ provide: SHARED_CONFIG_TOKEN, useFactory: configFactory }] };
  }
}

export {
  DistancePipe,
  DurationPipe,
  CoordinatePipe,
  UnitsService,
  GoogleMapsService,
  ISharedConfig,
  GeospatialService,
  PoiImagesToGalleryPipe
};
