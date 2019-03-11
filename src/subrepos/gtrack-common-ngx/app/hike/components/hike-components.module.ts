import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

import { FormModule } from 'subrepos/gtrack-common-web/forms';

import { BookmarkComponent } from './bookmark';
import { CheckpointsComponent } from './checkpoints';
import { DownloadGpxButtonComponent } from './download-gpx-button';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeCardComponent } from './hike-card';
import { HikeDataItemComponent } from './hike-data-item';
import { HikeInfoComponent } from './hike-info';
import { HikeProgramComponent } from './hike-program';
import { LocationSearchComponent } from './location-search';
import { SearchFiltersComponent } from './search-filters';
import { TrailBoxComponent } from './trail-box';

import { MapComponentsModule } from '../../map/components/map-components.module';
import { SearchFiltersModule } from '../../search-filters/search-filters.module';
import { SharedModule } from '../../shared/shared.module';
import { HikeModule } from '../hike.module';
import { HikeDayComponent } from './hike-day';
import { HikeListMapComponent } from './hike-list-map';
import { PoiMapComponent } from './poi-map';
import { SearchResultsMapComponent } from './search-results-map';

import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { ObjectMarkModule } from '../../object-mark';
import { ReverseHikeButtonComponent } from './reverse-hike-button';

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
  BookmarkComponent,
  HikeListMapComponent,
  PoiMapComponent,
  HikeDayComponent,
  ReverseHikeButtonComponent
];

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    SharedModule,
    ReactiveFormsModule,
    SearchFiltersModule,
    TranslateModule,
    StoreModule,
    MultiLanguageTextModule,
    ButtonModule,
    FontAwesomeModule,
    FormModule,
    DialogModule,
    GalleriaModule,
    ObjectMarkModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
