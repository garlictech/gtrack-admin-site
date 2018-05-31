import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';

import { TrailBoxComponent } from './trail-box';
import { HikeCardComponent } from './hike-card';
import { HikeInfoComponent } from './hike-info';
import { HikeDataItemComponent } from './hike-data-item';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeProgramComponent } from './hike-program';
import { CheckpointsComponent } from './checkpoints';
import { LocationSearchComponent } from './location-search';
import { SearchFiltersComponent } from './search-filters';

import { HikeModule } from '../hike.module';
import { MapModule } from '../../map/map.module';
import { MapComponentsModule } from '../../map/components/map-components.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchFiltersModule } from '../../search-filters/search-filters.module';

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    CommonModule,
    SharedModule,
    NouisliderModule,
    ReactiveFormsModule,
    SearchFiltersModule
  ],
  exports: [
    TrailBoxComponent,
    HikeCardComponent,
    HikeInfoComponent,
    HikeDataItemComponent,
    ElevationProfileComponent,
    HikeProgramComponent,
    CheckpointsComponent,
    LocationSearchComponent,
    SearchFiltersComponent
  ],
  declarations: [
    TrailBoxComponent,
    HikeCardComponent,
    HikeInfoComponent,
    HikeDataItemComponent,
    ElevationProfileComponent,
    HikeProgramComponent,
    CheckpointsComponent,
    LocationSearchComponent,
    SearchFiltersComponent
  ]
})
export class HikeComponentsModule {}
