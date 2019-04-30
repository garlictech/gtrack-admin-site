import { AngularSvgIconModule } from 'angular-svg-icon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@bit/garlictech.angular-features.web.forms-primeng';

import { SearchComponentsModule as SearchComponentsCommonModule } from '@bit/garlictech.angular-features.common.search';
import { LocationSearchComponent, SearchResultsMapComponent } from './components';

const COMPONENTS = [LocationSearchComponent, SearchResultsMapComponent];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    AngularSvgIconModule,
    SliderModule,
    SelectButtonModule,
    SearchComponentsCommonModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class SearchComponentsModule {}
