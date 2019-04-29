import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { SearchFiltersModule } from '@bit/garlictech.angular-features.common.search-filters';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

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
import { ReverseHikeButtonComponent } from './components/reverse-hike-button';
import { TrailBoxComponent } from './components/trail-box';

import { hikeReducer } from './store/reducer';
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
  TrailBoxComponent
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
    StoreModule.forFeature(featureName, hikeReducer)
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
