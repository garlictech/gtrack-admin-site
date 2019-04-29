import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationSearchComponent, SearchResultsMapComponent } from './components';

const COMPONENTS = [LocationSearchComponent, SearchResultsMapComponent];

@NgModule({
  imports: [CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class SearchComponentsModule {}
