import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { HikeProgramService } from './services/hike-program';
import { RouteService } from './services/route';
import { PoiService } from './services/poi';
import { CheckpointService } from './services/checkpoint';
import { GameRuleService } from './services/game-rule';
import { GeometryService } from './services/geometry';
import { ElevationService } from './services/elevation';
import { SearchFiltersModule } from '../search-filters';
import { GeoSearchModule } from '../geosearch';

import { EXTERNAL_POI_DEPENDENCIES, EXTERNAL_HIKE_DEPENDENCIES, EXTERNAL_ROUTE_DEPENDENCIES } from './externals';

import { HikeSelectors, PoiSelectors, RouteSelectors, HikeEffects, PoiEffects, RouteEffects } from './store';

import { SharedModule } from '../shared';
import { MapModule } from '../map';
import { IHikeModuleConfig } from './config';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapModule,
    SearchFiltersModule,
    GeoSearchModule,
    EffectsModule.forFeature([HikeEffects, PoiEffects, RouteEffects])
  ],
  providers: [
    HikeProgramService,
    RouteService,
    PoiService,
    GameRuleService,
    GeometryService,
    ElevationService,
    CheckpointService,
    PoiSelectors,
    HikeSelectors,
    PoiEffects,
    HikeEffects,
    RouteSelectors,
    RouteEffects
  ]
})
export class HikeModule {
  static forRoot(config: IHikeModuleConfig): ModuleWithProviders {
    return {
      ngModule: HikeModule,
      providers: [
        {
          provide: EXTERNAL_POI_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomains.poi
          }
        },
        {
          provide: EXTERNAL_HIKE_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomains.hike
          }
        },
        {
          provide: EXTERNAL_ROUTE_DEPENDENCIES,
          useValue: {
            storeDomain: config.storeDomains.route
          }
        }
      ]
    };
  }
}
