import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HikeService, Hike, IHike } from './services/hike';
import { HikeProgramService, HikeProgram } from './services/hike-program';
import { RouteService, Route, IElavationData, IElevationMargin } from './services/route';
import { PoiService, Poi, IPoi } from './services/poi';
import { ISegment } from './services/segment';
import { CheckpointService, Checkpoint, CheckpointSequence } from './services/checkpoint';
import { GameRuleService } from './services/game-rule';
import { GeometryService } from './services/geometry';
import { ElevationService } from './services/elevation';

import { TrailBoxComponent } from './components/trail-box';

import { SharedModule } from '../shared';
import { MapModule } from '../map';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapModule
  ],
  exports: [
    TrailBoxComponent
  ],
  declarations: [
    TrailBoxComponent
  ],
  providers: [
    HikeService,
    HikeProgramService,
    RouteService,
    PoiService,
    GameRuleService,
    GeometryService,
    ElevationService,
    CheckpointService
  ],
})
export class HikeModule {

}

export {
  IHike,
  Hike,
  HikeService,
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
  ElevationService,
  Checkpoint,
  CheckpointSequence,
  CheckpointService
}
