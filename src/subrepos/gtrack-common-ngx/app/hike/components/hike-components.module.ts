import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { TrailBoxComponent } from './trail-box';
import { HikeCardComponent } from './hike-card';
import { HikeInfoComponent } from './hike-info';
import { HikeDataItemComponent } from './hike-data-item';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeProgramComponent } from './hike-program';
import { CheckpointsComponent } from './checkpoints';
import { LocationSearchComponent } from './location-search';
import { SearchFiltersComponent } from './search-filters';
import { DownloadGpxButtonComponent } from './download-gpx-button';

import { HikeModule } from '../hike.module';
import { MapComponentsModule } from '../../map/components/map-components.module';
import { MapModule } from '../../map/map.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchFiltersModule } from '../../search-filters/search-filters.module';
import { SearchResultsMapComponent } from './search-results-map';

import { LocalizeModule } from '../../localize';

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    MapModule,
    CommonModule,
    SharedModule,
    NouisliderModule,
    ReactiveFormsModule,
    SearchFiltersModule,
    TranslateModule,
    StoreModule,
    LocalizeModule
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
    SearchFiltersComponent,
    SearchResultsMapComponent,
    DownloadGpxButtonComponent
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
    SearchFiltersComponent,
    SearchResultsMapComponent,
    DownloadGpxButtonComponent
  ]
})
export class HikeComponentsModule {}
