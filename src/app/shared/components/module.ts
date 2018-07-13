import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DropdownModule, ButtonModule } from 'primeng/primeng';

import { FormModule } from '../../forms';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';
import { AdminLeafletComponent } from './admin-leaflet';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    // PrimeNG
    DropdownModule,
    AccordionModule,
    ButtonModule
  ],
  declarations: [AdminLeafletComponent, LocalizedDescriptionComponent, TableSpinnerComponent],
  exports: [AdminLeafletComponent, LocalizedDescriptionComponent, TableSpinnerComponent]
})
export class SharedComponentsModule {}
