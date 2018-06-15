import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SearchFiltersModule } from './search-filters';

import { DeepstreamModule } from './deepstream';
import { AuthenticationModule } from './authentication';
import { DynamicModalModule } from './dynamic-modal';
import { SharedModule, defaultSharedConfig } from './shared';
import { MapModule, MapComponentsModule } from './map';
import {
  IHikeModuleConfig,
  HikeComponentsModule,
  HikeEffects,
  HikeModule,
  RouteEffects,
  PoiEffects,
  PoiSelectors
} from './hike';
import { RouterModule } from './router';
import { GeoSearchModule, GeoSearchEffects } from './geosearch';
import {
  BackgroundGeolocationModule,
  BackgroundGeolocationEffects
} from './shared/services/background-geolocation-service';

const sharedConfig = { ...defaultSharedConfig };

const hikeModuleConfig: IHikeModuleConfig = {
  storeDomains: {
    hike: 'hike',
    poi: 'poi',
    route: 'route'
  }
};

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JsonpModule,
    SearchFiltersModule.forRoot({
      storeDomain: 'searchFilters'
    }),
    SharedModule.forRoot(sharedConfig),
    MapModule,
    MapComponentsModule,
    HikeModule,
    RouterModule,
    HikeComponentsModule,
    BackgroundGeolocationModule.forRoot(),
    EffectsModule.forRoot([HikeEffects, PoiEffects, RouteEffects, GeoSearchEffects, BackgroundGeolocationEffects]),
    DeepstreamModule.forRoot(),
    DynamicModalModule,
    GeoSearchModule.forRoot({
      storeDomain: 'geosearch'
    }),
    DeepstreamModule.forRoot(),
    HikeModule.forRoot(hikeModuleConfig),
    BackgroundGeolocationModule.forRoot(),
    AuthenticationModule
  ],
  declarations: [],
  providers: [PoiSelectors],
  exports: []
})
export class GtrackCommonModule {}
