import { FormModule } from '@features/web/forms-primeng';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'subrepos/gtrack-common-ngx';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AdminMarkerPopupComponent } from './admin-marker-popup';
import { ImageMarkerPopupComponent } from './image-marker-popup';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';

const COMPONENTS = [
  LocalizedDescriptionComponent,
  TableSpinnerComponent,
  AdminMarkerPopupComponent,
  ImageMarkerPopupComponent
];
@NgModule({
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    FontAwesomeModule,
    MultiLanguageTextModule,
    SharedModule,
    // PrimeNG
    DropdownModule,
    AccordionModule,
    ButtonModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [AdminMarkerPopupComponent, ImageMarkerPopupComponent]
})
export class SharedComponentsModule {}
