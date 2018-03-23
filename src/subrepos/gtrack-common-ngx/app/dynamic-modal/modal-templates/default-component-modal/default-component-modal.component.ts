import { Component } from '@angular/core';
import { IDynamicComponentModalConfig } from '../dynamic-modal.interface';
import { DynamicModalCoreComponent } from '../../dynamic-modal-core.component';

@Component({
  selector: 'gt-default-component-modal',
  templateUrl: './default-component-modal.component.html',
  styleUrls: ['./default-component-modal.component.scss']
})

export class DefaultComponentModalComponent extends DynamicModalCoreComponent {}
