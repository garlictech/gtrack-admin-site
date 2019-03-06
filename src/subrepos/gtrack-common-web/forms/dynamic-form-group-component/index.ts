import { Component } from '@angular/core';

import { DynamicFormGroupComponent as NativeDynamicFormGroupComponent } from '@features/common/forms/dynamic-form-group-component';

@Component({
  selector: 'gtrack-form-group',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicFormGroupComponent extends NativeDynamicFormGroupComponent {
  trackByFn(index: number): number {
    return index;
  }
}
