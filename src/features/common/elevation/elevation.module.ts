import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';

import {
  ElevationFilledAreaComponent,
  ElevationLabelComponent,
  ElevationLineGraphComponent,
  ElevationPoiIconLinesComponent,
  ElevationPoiIconsComponent,
  ElevationProfileComponent,
  ElevationXAxisComponent,
  ElevationXAxisLinesComponent,
  ElevationYAxisComponent,
  ElevationYAxisLinesComponent,
  ElevationZoomSliderComponent
} from './components';

const COMPONENTS = [
  ElevationFilledAreaComponent,
  ElevationXAxisComponent,
  ElevationXAxisLinesComponent,
  ElevationYAxisComponent,
  ElevationYAxisLinesComponent,
  ElevationPoiIconsComponent,
  ElevationPoiIconLinesComponent,
  ElevationZoomSliderComponent,
  ElevationLabelComponent,
  ElevationLineGraphComponent,
  ElevationProfileComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, MultiLanguageTextModule, LeafletMapModule],
  exports: COMPONENTS,
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ElevationModule {}
