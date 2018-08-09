import { NgModule, ModuleWithProviders } from '@angular/core';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';
import { GeospatialService } from './services/geospatial';

import { ISharedConfig, SHARED_CONFIG_TOKEN } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe, PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { SanitizeHtmlDirective } from './directives/sanitize-html';
import { GeoIpService } from './services/geoip';

const PIPES = [
  DistancePipe,
  DurationPipe,
  CoordinatePipe,
  SanitizeHtmlDirective,
  PoiImagesToGalleryPipe,
  PoiImagesWithinCirclePipe
]
@NgModule({
  imports: [],
  declarations: [...PIPES],
  providers: [UnitsService, GoogleMapsService, GeospatialService, GeoIpService],
  exports: [...PIPES]
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
  PoiImagesToGalleryPipe,
  PoiImagesWithinCirclePipe
};
