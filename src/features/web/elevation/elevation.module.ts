import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ElevationModule as BaseModule } from '@bit/garlictech.angular-features.common.elevation';
import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { PoiComponentsModule } from '@bit/garlictech.angular-features.common.poi';
import { UtilsModule } from '@bit/garlictech.angular-features.common.utils';
import { LocalizeModule } from '@bit/garlictech.angular-features.web.localize';

import { ElevationProfileComponent, ElevationProfileLineComponent } from './components';

const COMPONENTS = [ElevationProfileComponent, ElevationProfileLineComponent];

@NgModule({
  imports: [
    CommonModule,
    MultiLanguageTextModule,
    LocalizeModule,
    MarkerIconsModule,
    UtilsModule,
    PoiComponentsModule,
    // PrimeNG
    DialogModule,
    GalleriaModule,
    BaseModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class ElevationModule {}
