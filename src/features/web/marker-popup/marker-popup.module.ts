import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkerPopupComponent } from './components/marker-popup/marker-popup.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MarkerPopupComponent],
  exports: [MarkerPopupComponent],
  entryComponents: [MarkerPopupComponent]
})
export class MarkerPopupModule {}
