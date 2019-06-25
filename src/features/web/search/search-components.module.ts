import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';

import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { SearchComponentsModule as SearchComponentsCommonModule } from '@bit/garlictech.angular-features.common.search';
import { TranslateModule } from '@ngx-translate/core';

import {
  FixedLocationSearchComponent,
  FloatingLocationSearchComponent,
  LocationSearchComponent,
  SearchResultsMapComponent
} from './components';

const COMPONENTS = [
  LocationSearchComponent,
  SearchResultsMapComponent,
  FixedLocationSearchComponent,
  FloatingLocationSearchComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    AngularSvgIconModule,
    SliderModule,
    SelectButtonModule,
    SearchComponentsCommonModule,
    TranslateModule,
    LeafletMapModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class SearchComponentsModule {}
