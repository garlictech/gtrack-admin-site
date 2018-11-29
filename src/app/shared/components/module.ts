import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormModule } from 'subrepos/gtrack-common-web/forms';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';
import { AdminMarkerPopupComponent } from './admin-marker-popup';
import { LocalizeModule, SharedModule } from 'subrepos/gtrack-common-ngx';
import { ImageMarkerPopupComponent } from './image-marker-popup';

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
    LocalizeModule,
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
