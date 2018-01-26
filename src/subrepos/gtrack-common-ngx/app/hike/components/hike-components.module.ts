import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrailBoxComponent } from './trail-box';
import { HikeCardComponent } from './hike-card';
import { HikeInfoComponent } from './hike-info';
import { HikeDataItemComponent } from './hike-data-item';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeProgramComponent } from './hike-program';
import { CheckpointsComponent } from './checkpoints';

import { HikeModule } from '../hike.module';
import { MapModule } from '../../map/map.module';
import { MapComponentsModule } from '../../map/components/map-components.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    CommonModule,
    SharedModule
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
  ]
})
export class HikeComponentsModule {

}
