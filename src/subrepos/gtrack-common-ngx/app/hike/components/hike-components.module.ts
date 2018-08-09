import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  DownloadGpxButtonComponent
];

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    MapModule,
    SharedModule,
    NouisliderModule,
    ReactiveFormsModule,
    SearchFiltersModule,
    TranslateModule,
    StoreModule,
    LocalizeModule,
    ButtonModule,
    FontAwesomeModule,
    DialogModule,
    GalleriaModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
