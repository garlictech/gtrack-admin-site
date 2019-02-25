import { Component } from '@angular/core';

import { DynamicFormComponent as NativeDynamicFormComponent } from '@bit/garlictech.angular-features.common.forms';

@Component({
  selector: 'gtrack-form',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicFormComponent extends NativeDynamicFormComponent {
  trackByFn(index: number): number {
    return index;
  }
}
