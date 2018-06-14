import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DropdownModule } from 'primeng/primeng';

import { FormModule } from 'subrepos/forms-ngx';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';
import { AdminLeafletComponent } from './admin-leaflet';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    AccordionModule,
    FormModule,
    FormsModule
  ],
  declarations: [
    AdminLeafletComponent,
    LocalizedDescriptionComponent,
    TableSpinnerComponent
  ],
  exports: [
    AdminLeafletComponent,
    LocalizedDescriptionComponent,
    TableSpinnerComponent
  ]
})
export class SharedComponentsModule {}
