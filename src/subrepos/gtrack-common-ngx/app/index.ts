import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule  } from 'angularfire2/database';

import { HikeService, Hike, IHike } from './hike';
import { HikeProgramService, HikeProgram } from './hike-program';
import { LeafletComponent, Center } from './leaflet';
import { RouteService, Route, IElavationData, IElevationMargin } from './route';
import { GeometryService } from './geometry';
import { ElevationService } from './elevation';
import { CheckpointService, Checkpoint, CheckpointSequence } from './checkpoint';
import { GameRuleService } from './game-rule';
import { DeepstreamModule } from './deepstream';

import {
  MapService,
  CheckpointMarker,
  CurrentPositionMarker,
  Map
} from './map';

import { UnitsService } from './units';
import { PoiService, Poi } from './poi';
import { IconService } from './icon';
import { MapMarkerService, MapMarker } from './map-marker';
import { GoogleMapsService } from './google-maps';
import { CommonConfig } from './config';
import { ISegment } from './segment';

import {
  DistancePipe,
  DurationPipe,
  CoordinatePipe
} from './pipes';

@NgModule({
  declarations: [
    DistancePipe,
    DurationPipe,
    CoordinatePipe,
    LeafletComponent
  ],
  imports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    DeepstreamModule
  ],
  providers: [
    HikeService,
    HikeProgramService,
    PoiService,
    UnitsService,
    RouteService,
    MapService,
    IconService,
    MapMarkerService,
    GoogleMapsService,
    GeometryService,
    ElevationService,
    CheckpointService,
    GameRuleService
  ],
  exports: [
    DistancePipe,
    CoordinatePipe,
    DurationPipe,
    LeafletComponent
  ]
})
export class CommonModule {
  static forRoot(config: CommonConfig): ModuleWithProviders {
    return {
      ngModule: CommonModule,
      providers: [
        {
          provide: CommonConfig,
          useValue: config
        }
      ]
    };
  }
}

export {
  IHike,
  Hike,
  HikeService,
  HikeProgram,
  HikeProgramService,
  IElavationData,
  IElevationMargin,
  Poi,
  IPoi,
  PoiService,
  DistancePipe,
  CoordinatePipe,
  DurationPipe,
  LeafletComponent,
  Center,
  UnitsService,
  RouteService,
  Route,
  IconService,
  MapService,
  MapMarkerService,
  MapMarker,
  CheckpointMarker,
  CurrentPositionMarker,
  Map,
  GoogleMapsService,
  CommonConfig,
  GeometryService,
  ElevationService,
  Checkpoint,
  CheckpointSequence,
  CheckpointService,
  GameRuleService,
  DeepstreamModule,
  ISegment
};
