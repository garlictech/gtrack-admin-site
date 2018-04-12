import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DropdownModule } from 'primeng/primeng';

import { FormModule } from 'subrepos/forms-ngx';
import { LocalizedDescriptionComponent } from './locatlized-description';

@NgModule({
  imports: [CommonModule, DropdownModule, AccordionModule, FormModule, FormsModule],
  declarations: [LocalizedDescriptionComponent],
  exports: [LocalizedDescriptionComponent]
})
export class SharedComponentsModule {}
