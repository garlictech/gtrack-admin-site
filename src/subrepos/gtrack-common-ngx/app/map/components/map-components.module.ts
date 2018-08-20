import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapModule } from '../map.module';
import { IconComponent } from './icon';
import { LeafletComponent } from './leaflet';
import { MarkerPopupComponent } from './marker-popup';
import { LocalizeModule } from '../../localize';

// PrimeNG
import {
  ButtonModule
} from 'primeng/primeng';

const COMPONENTS = [
  LeafletComponent,
  IconComponent,
  MarkerPopupComponent
];

@NgModule({
  imports: [
    CommonModule,
    MapModule,
    LocalizeModule,
    // PrimeNG
    ButtonModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [
    MarkerPopupComponent
  ]
})
export class MapComponentsModule {}
