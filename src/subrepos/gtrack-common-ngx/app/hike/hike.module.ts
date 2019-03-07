import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { GeoSearchModule } from '../geosearch';
import { SearchFiltersModule } from '../search-filters';
import { CheckpointService } from './services/checkpoint';
import { ElevationService } from './services/elevation';
import { GameRuleService } from './services/game-rule';
import { GeometryService } from './services/geometry';
import { HikeProgramService } from './services/hike-program';
import { PoiService } from './services/poi';
import { RouteService } from './services/route';

import { EXTERNAL_HIKE_DEPENDENCIES, EXTERNAL_POI_DEPENDENCIES, EXTERNAL_ROUTE_DEPENDENCIES } from './externals';

import { HikeEffects, HikeSelectors, PoiEffects, PoiSelectors, RouteEffects, RouteSelectors } from './store';

import { SharedModule } from '../shared';
import { HikeModuleConfig } from './config';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
  static forRoot(config: HikeModuleConfig): ModuleWithProviders {
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
