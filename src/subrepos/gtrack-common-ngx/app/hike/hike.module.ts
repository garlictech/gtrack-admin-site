import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HikeService, Hike, IHike } from './services/hike';
import { HikeProgramService, HikeProgram } from './services/hike-program';
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

import { SharedModule } from '../shared';
import { MapModule } from '../map';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapModule
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
  CheckpointsComponent
}
