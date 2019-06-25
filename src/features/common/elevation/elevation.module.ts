import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';

import { RouterModule } from '@angular/router';
import {
  ElevationFilledAreaComponent,
  ElevationLabelComponent,
  ElevationLineGraphComponent,
  ElevationMaxPointComponent,
  ElevationPoiIconLinesComponent,
  ElevationPoiIconsComponent,
  ElevationProfileComponent,
  ElevationProfileLineComponent,
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
  ElevationMaxPointComponent,
  ElevationProfileComponent,
  ElevationProfileLineComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, RouterModule, MultiLanguageTextModule, LeafletMapModule],
  exports: COMPONENTS,
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ElevationModule {}
