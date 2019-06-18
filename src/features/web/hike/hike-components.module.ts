import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AstronomyModule } from '@bit/garlictech.angular-features.common.astronomy';
import { TrustedPipesModule } from '@bit/garlictech.angular-features.common.generic-ui';
import { HikeComponentsModule as BaseHikeComponentsModule } from '@bit/garlictech.angular-features.common.hike';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { UtilsModule } from '@bit/garlictech.angular-features.common.utils';
import { WeatherModule as BaseWeatherModule } from '@bit/garlictech.angular-features.common.weather';
import { ElevationModule } from '@bit/garlictech.angular-features.web.elevation';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';
import { LocalizeModule as WebLocalizeModule } from '@bit/garlictech.angular-features.web.localize';
import { SlideshowModule } from '@bit/garlictech.angular-features.web.slideshow';
import { WeatherModule } from '@bit/garlictech.angular-features.web.weather';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';
import { SearchComponentsModule } from '@bit/garlictech.angular-features.web.search';
import { SearchFiltersComponentsModule } from '@bit/garlictech.angular-features.web.search-filters';
import { BookmarkComponent } from './components/bookmark';
import { CheckpointsComponent } from './components/checkpoints';
import { DownloadGpxButtonComponent } from './components/download-gpx-button';
import { GalleryComponent } from './components/gallery';
import { CardShadowDirective, HikeCardComponent } from './components/hike-card';
import { HikeDataItemComponent } from './components/hike-data-item';
import { HikeDataPopupComponent } from './components/hike-data-popup';
import { HikeDayComponent } from './components/hike-day';
import { HikeInfoComponent } from './components/hike-info';
import { HikeListMapComponent } from './components/hike-list-map';
import { HikeListComponent } from './components/hike-list/hike-list.component';
import { HikeMapComponent } from './components/hike-map';
import { HikeProgramComponent } from './components/hike-program';
import { HikeProgramPageComponent } from './components/hike-program-page';
import { HikeSettingsComponent } from './components/hike-settings';
import { ReverseHikeButtonComponent } from './components/reverse-hike-button';
import { TrailBoxComponent } from './components/trail-box';

const COMPONENTS = [
  BookmarkComponent,
  CheckpointsComponent,
  DownloadGpxButtonComponent,
  HikeCardComponent,
  CardShadowDirective,
  HikeDataItemComponent,
  HikeDataPopupComponent,
  HikeDayComponent,
  HikeInfoComponent,
  HikeListMapComponent,
  HikeMapComponent,
  HikeProgramComponent,
  HikeProgramPageComponent,
  ReverseHikeButtonComponent,
  TrailBoxComponent,
  GalleryComponent,
  HikeSettingsComponent,
  HikeListComponent
];

@NgModule({
  imports: [
    CommonModule,
    LeafletMapModule,
    FontAwesomeModule,
    ButtonModule,
    DialogModule,
    GalleriaModule,
    TranslateModule,
    ReactiveFormsModule,
    WebLocalizeModule,
    FormModule,
    BaseHikeComponentsModule,
    AngularSvgIconModule,
    BaseWeatherModule,
    WeatherModule,
    SliderModule,
    SelectButtonModule,
    TrustedPipesModule,
    UtilsModule,
    ElevationModule,
    MarkerIconsModule,
    SlideshowModule,
    AstronomyModule,
    RouterModule,
    SearchComponentsModule,
    SearchFiltersComponentsModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [HikeDataPopupComponent]
})
export class HikeComponentsModule {}
