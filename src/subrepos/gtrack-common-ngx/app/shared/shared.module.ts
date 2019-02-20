import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { GeoIpService } from '@features/common/current-geolocation';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GalleriaModule } from 'primeng/galleria';
import { LightboxModule } from 'primeng/lightbox';
import { SlideShowComponent } from './components';
import { SanitizeHtmlDirective } from './directives/sanitize-html';
import { CoordinatePipe, DistancePipe, DurationPipe, PoiImagesToGalleryPipe, PoiImagesWithinCirclePipe } from './pipes';
import { GeospatialService } from './services/geospatial';
import { GoogleMapsService } from './services/google-maps';

import { SHARED_CONFIG_TOKEN, SharedConfig } from './config';
import { UnitsService } from './services/units';

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
  imports: [CommonModule, FontAwesomeModule, GalleriaModule, LightboxModule],
  declarations: [...DECLARATIONS],
  providers: [UnitsService, GoogleMapsService, GeospatialService, GeoIpService],
  exports: [...DECLARATIONS]
})
export class SharedModule {
  static forRoot(configFactory: any): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [{ provide: SHARED_CONFIG_TOKEN, useFactory: configFactory }]
    };
  }
}

export {
  DistancePipe,
  DurationPipe,
  CoordinatePipe,
  UnitsService,
  GoogleMapsService,
  SharedConfig,
  GeospatialService,
  PoiImagesToGalleryPipe,
  PoiImagesWithinCirclePipe,
  SlideShowComponent
};
