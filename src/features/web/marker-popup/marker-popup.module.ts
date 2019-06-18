import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkerIconsModule } from '@bit/garlictech.angular-features.common.marker-icons';
import { UtilsModule } from '@bit/garlictech.angular-features.common.utils';
import { LocalizeModule } from '@bit/garlictech.angular-features.web.localize';
import { PoiComponentsModule } from '@bit/garlictech.angular-features.web.poi';
import { DialogModule } from 'primeng/dialog';
import { MarkerPopupComponent } from './components/marker-popup/marker-popup.component';

@NgModule({
  imports: [CommonModule, LocalizeModule, UtilsModule, MarkerIconsModule, DialogModule, PoiComponentsModule],
  declarations: [MarkerPopupComponent],
  exports: [MarkerPopupComponent],
  entryComponents: [MarkerPopupComponent]
})
export class MarkerPopupModule {}
