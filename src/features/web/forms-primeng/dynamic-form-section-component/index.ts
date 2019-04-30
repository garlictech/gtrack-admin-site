import { Component } from '@angular/core';

import { DynamicFormSectionComponent as NativeDynamicFormSectionComponent } from '@bit/garlictech.angular-features.common.forms';

@Component({
  selector: 'gtrack-form-section',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicFormSectionComponent extends NativeDynamicFormSectionComponent {
  trackByFn(index: number): number {
    return index;
  }
}
