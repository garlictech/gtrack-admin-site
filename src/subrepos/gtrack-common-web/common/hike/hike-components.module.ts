import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SliderModule } from 'primeng/slider';
import { AstronomyModule } from 'subrepos/gtrack-common-ngx';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { WeatherModule as BaseWeatherModule } from '@features/common/weather';
import { WeatherModule } from '@features/web/weather';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { MapComponentsModule, SharedModule } from '../../../gtrack-common-ngx';
import { HikeComponentsModule as BaseModule } from '../../../gtrack-common-ngx/app/hike/components';
import { FormModule } from '../../forms';
import { LocalizeModule as WebLocalizeModule } from '../localize';
import { BookmarkComponent } from './bookmark';
import { CheckpointsComponent } from './checkpoints';
import { DownloadGpxButtonComponent } from './download-gpx-button';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeCardComponent } from './hike-card';
import { HikeDataItemComponent } from './hike-data-item';
import { HikeDayComponent } from './hike-day';
import { HikeInfoComponent } from './hike-info';
import { HikeListMapComponent } from './hike-list-map';
import { HikeMapComponent } from './hike-map';
import { HikeProgramComponent } from './hike-program';
import { HikeProgramPageComponent } from './hike-program-page';
import { LocationSearchComponent } from './location-search';
import { PoiMapComponent } from './poi-map';
import { PoiPageComponent } from './poi-page';
import { ReverseHikeButtonComponent } from './reverse-hike-button';
import { SearchFiltersComponent } from './search-filters';
import { SearchResultsMapComponent } from './search-results-map';
import { TrailBoxComponent } from './trail-box';

const WEATHER_CONFIG = {
  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78'
  }
};

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
  HikeListMapComponent,
  DownloadGpxButtonComponent,
  HikeProgramPageComponent,
  PoiPageComponent,
  HikeMapComponent,
  BookmarkComponent,
  PoiMapComponent,
  HikeDayComponent,
  ReverseHikeButtonComponent
];

@NgModule({
  imports: [
    CommonModule,
    MapComponentsModule,
    LeafletMapModule,
    BaseModule,
    FontAwesomeModule,
    SharedModule,
    ButtonModule,
    DialogModule,
    GalleriaModule,
    TranslateModule,
    ReactiveFormsModule,
    WebLocalizeModule,
    FormModule,
    AstronomyModule,
    AngularSvgIconModule,
    BaseWeatherModule.forRoot(WEATHER_CONFIG),
    WeatherModule,
    SliderModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
