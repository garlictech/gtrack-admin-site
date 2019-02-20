import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

import { WeatherModule as BaseWeatherModule } from '@features/common/weather';
import { WeatherModule } from '@features/web/weather';
import { AstronomyModule } from 'subrepos/gtrack-common-ngx';
import { HikeComponentsModule as BaseModule } from '../../../gtrack-common-ngx/app/hike/components';

import { BookmarkComponent } from './bookmark';
import { CheckpointsComponent } from './checkpoints';
import { DownloadGpxButtonComponent } from './download-gpx-button';
import { ElevationProfileComponent } from './elevation-profile';
import { HikeCardComponent } from './hike-card';
import { HikeDataItemComponent } from './hike-data-item';
import { HikeDayComponent } from './hike-day';
import { HikeInfoComponent } from './hike-info';
import { HikeMapComponent } from './hike-map';
import { HikeProgramComponent } from './hike-program';
import { HikeProgramPageComponent } from './hike-program-page';
import { PoiPageComponent } from './poi-page';
import { ReverseHikeButtonComponent } from './reverse-hike-button';

import { MapComponentsModule, SharedModule } from '../../../gtrack-common-ngx';
import { FormModule } from '../../forms';
import { HikeListMapComponent } from './hike-list-map';
import { LocationSearchComponent } from './location-search';
import { PoiMapComponent } from './poi-map';
import { SearchFiltersComponent } from './search-filters';
import { SearchResultsMapComponent } from './search-results-map';
import { TrailBoxComponent } from './trail-box';

import { LeafletMapModule } from '@features/common/leaflet-map';
import { SliderModule } from 'primeng/slider';

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
    BaseWeatherModule,
    WeatherModule,
    SliderModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class HikeComponentsModule {}
