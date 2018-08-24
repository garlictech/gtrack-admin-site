import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';

import { HikeComponentsModule as BaseModule } from '../../../gtrack-common-ngx/app/hike/components';

import { CheckpointsComponent } from './checkpoints';
import { DownloadGpxButtonComponent } from './download-gpx-button';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeCardComponent } from './hike-card';
import { HikeDataItemComponent } from './hike-data-item';
import { HikeInfoComponent } from './hike-info';
import { HikeProgramComponent } from './hike-program';
import { HikeProgramPageComponent } from './hike-program-page';
import { HikeMapComponent } from './hike-map';

import { LocationSearchComponent } from './location-search';
import { SearchFiltersComponent } from './search-filters';
import { SearchResultsMapComponent } from './search-results-map';
import { TrailBoxComponent } from './trail-box';
import { MapComponentsModule, LocalizeModule, SharedModule } from '../../../gtrack-common-ngx';

import { LocalizeModule as WebLocalizeModule } from '../localize';

const COMPONENTS = [
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
  DownloadGpxButtonComponent,
  HikeProgramPageComponent,
  HikeMapComponent
];

@NgModule({
  imports: [
    CommonModule,
    MapComponentsModule,
    BaseModule,
    FontAwesomeModule,
    LocalizeModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    GalleriaModule,
    TranslateModule,
    ReactiveFormsModule,
    NouisliderModule,
    WebLocalizeModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
