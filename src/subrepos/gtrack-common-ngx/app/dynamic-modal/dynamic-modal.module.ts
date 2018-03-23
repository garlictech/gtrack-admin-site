import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicModalContainerComponent } from './dynamic-modal-container.component';
import {
  DefaultComponentModalComponent
} from './modal-templates/default-component-modal/default-component-modal.component';
import { DynamicModalService } from './dynamic-modal.service';
import { DynamicModalCoreComponent } from './dynamic-modal-core.component';

const COMPONENTS = [
  DynamicModalContainerComponent,
  DefaultComponentModalComponent,
  DynamicModalCoreComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DynamicModalContainerComponent,
    DynamicModalCoreComponent
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
