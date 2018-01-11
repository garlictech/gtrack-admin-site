import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HikeProgramService, HikeProgram, IHikeProgram } from './services/hike-program';
import { RouteService, Route, IElevationData, IElevationMargin } from './services/route';
import { PoiService, Poi, IPoi } from './services/poi';
import { ISegment } from './services/segment';
import { CheckpointService, Checkpoint, CheckpointSequence } from './services/checkpoint';
import { GameRuleService } from './services/game-rule';
import { GeometryService, CenterRadius } from './services/geometry';
import { ElevationService } from './services/elevation';

import { TrailBoxComponent } from './components/trail-box';
import { HikeCardComponent } from './components/hike-card';
import { HikeInfoComponent } from './components/hike-info';
import { HikeDataItemComponent } from './components/hike-data-item';
import { ElevationProfileComponent } from './components/elevation-profile';
import { HikeProgramComponent } from './components/hike-program';
import { CheckpointsComponent } from './components/checkpoints';

import { EXTERNAL_POI_DEPENDENCIES, EXTERNAL_HIKE_DEPENDENCIES, EXTERNAL_ROUTE_DEPENDENCIES } from './externals';

import {
  HikeSelectors,
  PoiSelectors,
  RouteSelectors,
  HikeEffects,
  PoiEffects,
  RouteEffects
} from './store';

import { SharedModule } from '../shared';
import { MapModule } from '../map';
import { RouterModule } from '../router';
import { HikeModuleConfig } from './config';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapModule,
    RouterModule
  ],
  exports: [
    TrailBoxComponent,
    HikeCardComponent,
    HikeInfoComponent,
    HikeDataItemComponent,
    ElevationProfileComponent,
    HikeProgramComponent,
    CheckpointsComponent
  ],
  declarations: [
    TrailBoxComponent,
    HikeCardComponent,
    HikeInfoComponent,
    HikeDataItemComponent,
    ElevationProfileComponent,
    HikeProgramComponent,
    CheckpointsComponent
  ],
  providers: [
    HikeProgramService,
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
  ],
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
    }
  }
}

export {
  IHikeProgram,
  HikeProgram,
  HikeProgramService,
  RouteService,
  Route,
  PoiService,
  Poi,
  IPoi,
  ISegment,
  TrailBoxComponent,
  GameRuleService,
  GeometryService,
  CenterRadius,
  ElevationService,
  Checkpoint,
  CheckpointSequence,
  CheckpointService,
  HikeCardComponent,
  HikeInfoComponent,
  HikeDataItemComponent,
  ElevationProfileComponent,
  HikeProgramComponent,
  CheckpointsComponent,
  HikeModuleConfig
}
