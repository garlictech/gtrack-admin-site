import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

const sharedConfig = { ...defaultSharedConfig };

const hikeModuleConfig: IHikeModuleConfig = {
  storeDomains: {
    hike: 'hike',
    poi: 'poi',
    route: 'route'
  }
};

import {
  SharedModule,
  DeepstreamModule,
  MapModule,
  MapComponentsModule,
  HikeModule,
  RouterModule,
  IHikeModuleConfig,
  HikeComponentsModule,
  HikeEffects,
  PoiEffects,
  RouteEffects,
  DynamicModalModule,
  GeoSearchModule,
  GeoSearchEffects,
  BackgroundGeolocationModule,
  BackgroundGeolocationEffects,
  defaultSharedConfig,
  PoiSelectors
} from './';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JsonpModule,
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
    BackgroundGeolocationModule.forRoot()
  ],
  declarations: [],
  providers: [PoiSelectors],
  exports: []
})
export class GtrackCommonModule {}
