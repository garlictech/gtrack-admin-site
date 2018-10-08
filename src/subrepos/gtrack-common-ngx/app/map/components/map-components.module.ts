import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MapModule } from '../map.module';
import { IconComponent } from './icon';
import { LeafletComponent } from './leaflet';
import { LocalizeModule } from '../../localize';
import { SharedModule } from '../../shared';

// PrimeNG
import { ButtonModule } from 'primeng/button';

const COMPONENTS = [LeafletComponent, IconComponent];

@NgModule({
  imports: [
    CommonModule,
    MapModule,
    LocalizeModule,
    // PrimeNG
    ButtonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class MapComponentsModule {}
