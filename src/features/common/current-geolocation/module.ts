import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CurrentGeoLocationComponent } from './components';
import { CURRENT_GEOLOCATION_CONFIG, GEO_IP_CONFIG, GEO_TIMEOUT_CONFIG } from './config';
import { GpsLocationService as Service } from './services';
import { GeoIpService } from './services/geoip';
import { reducer } from './store';
import { CurrentGeolocationEffects as Effects } from './store/effects';
import { featureName } from './store/state';

@NgModule({
  declarations: [CurrentGeoLocationComponent],
  imports: [HttpClientModule, StoreModule.forFeature(featureName, reducer), EffectsModule.forFeature([Effects])]
})
export class CurrentGeolocationModule {
  static forRoot(
    timeOut,
    geoIpEndpoint,
    config = { debug: false, interval: 60000, minDistance: 5 }
  ): ModuleWithProviders {
    return {
      ngModule: CurrentGeolocationModule,
      providers: [
        Service,
        Effects,
        { provide: CURRENT_GEOLOCATION_CONFIG, useValue: config },
        { provide: GEO_TIMEOUT_CONFIG, useValue: timeOut },
        { provide: GEO_IP_CONFIG, useValue: geoIpEndpoint },
        GeoIpService
      ]
    };
  }
}
