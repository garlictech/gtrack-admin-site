import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';

import { FormModule } from 'app/forms';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';
import { AdminLeafletComponent } from './admin-leaflet';

@NgModule({
  imports: [CommonModule, DropdownModule, AccordionModule, FormModule, FormsModule],
  declarations: [AdminLeafletComponent, LocalizedDescriptionComponent, TableSpinnerComponent],
  exports: [AdminLeafletComponent, LocalizedDescriptionComponent, TableSpinnerComponent]
})
export class SharedComponentsModule {}
