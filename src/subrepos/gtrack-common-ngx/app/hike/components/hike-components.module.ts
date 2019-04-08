import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { FormModule } from 'subrepos/gtrack-common-web/forms';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { MapComponentsModule } from '../../map/components/map-components.module';
import { ObjectMarkModule } from '../../object-mark';
import { SharedModule } from '../../shared/shared.module';
import { HikeModule } from '../hike.module';
import { BookmarkComponent } from './bookmark';
import { CheckpointsComponent } from './checkpoints';
import { DownloadGpxButtonComponent } from './download-gpx-button';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeCardComponent } from './hike-card';
import { HikeDataItemComponent } from './hike-data-item';
import { HikeDayComponent } from './hike-day';
import { HikeInfoComponent } from './hike-info';
import { HikeListMapComponent } from './hike-list-map';
import { HikeProgramComponent } from './hike-program';
import { LocationSearchComponent } from './location-search';
import { PoiMapComponent } from './poi-map';
import { ReverseHikeButtonComponent } from './reverse-hike-button';
import { SearchFiltersComponent } from './search-filters';
import { SearchResultsMapComponent } from './search-results-map';
import { TrailBoxComponent } from './trail-box';

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
