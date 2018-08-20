import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule, DropdownModule, ButtonModule } from 'primeng/primeng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormModule } from 'subrepos/gtrack-common-web/forms';
import { LocalizedDescriptionComponent } from './localized-description';
import { TableSpinnerComponent } from './table-spinner';
import { AdminLeafletComponent } from './admin-leaflet';
import { AdminMarkerPopupComponent } from './admin-marker-popup';
import { LocalizeModule } from 'subrepos/gtrack-common-ngx';

const COMPONENTS = [
  AdminLeafletComponent,
  LocalizedDescriptionComponent,
  TableSpinnerComponent,
  AdminMarkerPopupComponent
]
@NgModule({
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    FontAwesomeModule,
    LocalizeModule,
    // PrimeNG
    DropdownModule,
    AccordionModule,
    ButtonModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ],
  entryComponents: [
    AdminMarkerPopupComponent
  ]
})
export class SharedComponentsModule {}
