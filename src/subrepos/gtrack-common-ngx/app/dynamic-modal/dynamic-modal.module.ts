import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicModalContainerComponent } from './dynamic-modal-container.component';
import { ComponentModalComponent } from './component-modal/component-modal.component';
import { DynamicModalService } from './dynamic-modal.service';

const COMPONENTS = [
  DynamicModalContainerComponent,
  ComponentModalComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DynamicModalContainerComponent
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    ...COMPONENTS
  ],
  providers: [
    DynamicModalService
  ]
})
export class DynamicModalModule {}
