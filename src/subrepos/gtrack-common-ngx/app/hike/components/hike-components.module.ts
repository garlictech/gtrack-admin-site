import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormModule } from 'subrepos/gtrack-common-web/forms';

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
import { BookmarkComponent } from './bookmark';

import { HikeModule } from '../hike.module';
import { MapComponentsModule } from '../../map/components/map-components.module';
import { MapModule } from '../../map/map.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchFiltersModule } from '../../search-filters/search-filters.module';
import { SearchResultsMapComponent } from './search-results-map';
import { HikeListMapComponent } from './hike-list-map';
import { PoiMapComponent } from './poi-map';
import { HikeDayComponent } from './hike-day';

import { LocalizeModule } from '../../localize';
import { ObjectMarkModule } from '../../object-mark';

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
  HikeDayComponent
];

@NgModule({
  imports: [
    HikeModule,
    MapComponentsModule,
    MapModule,
    SharedModule,
    ReactiveFormsModule,
    SearchFiltersModule,
    TranslateModule,
    StoreModule,
    LocalizeModule,
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
