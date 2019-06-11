import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GeoSearchModule } from '@bit/garlictech.angular-features.common.geosearch';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { ObjectMarkModule } from '@bit/garlictech.angular-features.common.object-mark';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { HikeListComponent, HikeSettingsComponent, SearchResultsMapComponent } from './components';
import { BookmarkComponent } from './components/bookmark';
import { CheckpointsComponent } from './components/checkpoints';
import { DownloadGpxButtonComponent } from './components/download-gpx-button';
import { HikeCardComponent } from './components/hike-card';
import { HikeDataItemComponent } from './components/hike-data-item';
import { HikeDataPopupComponent } from './components/hike-data-popup/hike-data-popup.component';
import { HikeDayComponent } from './components/hike-day';
import { HikeInfoComponent } from './components/hike-info';
import { HikeListMapComponent } from './components/hike-list-map';
import { HikeProgramComponent } from './components/hike-program';
import { LocationSearchComponent } from './components/location-search';
import { ReverseHikeButtonComponent } from './components/reverse-hike-button';
import { TrailBoxComponent } from './components/trail-box';
import { getReducers, HIKE_REDUCER_TOKEN, HikeEffects, HikeSelectors } from './store';
import { featureName } from './store/state';

const COMPONENTS = [
  BookmarkComponent,
  CheckpointsComponent,
  DownloadGpxButtonComponent,
  HikeCardComponent,
  HikeDataItemComponent,
  HikeDataPopupComponent,
  HikeDayComponent,
  HikeInfoComponent,
  HikeListMapComponent,
  HikeProgramComponent,
  ReverseHikeButtonComponent,
  TrailBoxComponent,
  LocationSearchComponent,
  HikeSettingsComponent,
  HikeListComponent,
  SearchResultsMapComponent
];

@NgModule({
  imports: [
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
    GeoSearchModule,
    ObjectMarkModule,
    StoreModule.forFeature(featureName, HIKE_REDUCER_TOKEN),
    EffectsModule.forFeature([HikeEffects])
  ],
  providers: [
    HikeSelectors,
    {
      provide: HIKE_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
