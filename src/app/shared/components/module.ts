import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';

import { FormModule } from 'app/forms';
import { LocalizedDescriptionComponent } from './localized-description';

@NgModule({
  imports: [CommonModule, DropdownModule, AccordionModule, FormModule, FormsModule],
  declarations: [LocalizedDescriptionComponent],
  exports: [LocalizedDescriptionComponent]
})
export class SharedComponentsModule {}
