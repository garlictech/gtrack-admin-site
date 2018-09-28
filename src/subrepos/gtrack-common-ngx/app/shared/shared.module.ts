import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UnitsService } from './services/units';
import { GoogleMapsService } from './services/google-maps';
import { GeospatialService } from './services/geospatial';

import { ISharedConfig, SHARED_CONFIG_TOKEN } from './config';

import { DistancePipe, DurationPipe, CoordinatePipe, PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { SanitizeHtmlDirective } from './directives/sanitize-html';
import { SlideShowComponent } from './components';
import { GeoIpService } from './services/geoip';

const DECLARATIONS = [
  DistancePipe,
  DurationPipe,
  CoordinatePipe,
  SanitizeHtmlDirective,
  SlideShowComponent,
  PoiImagesToGalleryPipe,
  PoiImagesWithinCirclePipe
];

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [...DECLARATIONS],
  providers: [UnitsService, GoogleMapsService, GeospatialService, GeoIpService],
  exports: [...DECLARATIONS]
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
  PoiImagesWithinCirclePipe,
  SlideShowComponent
};
