import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletMapModule } from '@bit/garlictech.angular-features.common.leaflet-map';
import { UtilsModule } from '@bit/garlictech.angular-features.common.utils';
import { HikeComponentsModule } from '@bit/garlictech.angular-features.web.hike';
import { LocalizeModule } from '@bit/garlictech.angular-features.web.localize';
import { PoiMapComponent, PoiPageComponent } from './components';

const COMPONENTS = [PoiPageComponent, PoiMapComponent];

@NgModule({
  imports: [CommonModule, LocalizeModule, UtilsModule, HikeComponentsModule, LeafletMapModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class PoiComponentsModule {}
