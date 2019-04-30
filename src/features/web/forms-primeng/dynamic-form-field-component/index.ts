import { Component } from '@angular/core';

import { DynamicFormFieldComponent as NativeDynamicFormFieldComponent } from '@bit/garlictech.angular-features.common.forms';

@Component({
  selector: 'gtrack-form-field',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicFormFieldComponent extends NativeDynamicFormFieldComponent {}
