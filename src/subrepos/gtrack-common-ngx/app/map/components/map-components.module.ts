import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapModule } from '../map.module';
import { IconComponent } from './icon';
import { LeafletComponent, Center } from './leaflet';

@NgModule({
  imports: [
    CommonModule,
    MapModule
  ],
  exports: [
    LeafletComponent,
    IconComponent
  ],
  declarations: [
    LeafletComponent,
    IconComponent
  ]
})
export class MapComponentsModule { }
