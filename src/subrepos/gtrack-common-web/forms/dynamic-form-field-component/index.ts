import { Component } from '@angular/core';

import { DynamicFormFieldComponent as NativeDynamicFormFieldComponent } from '@bit/garlictech.angular-features.common.forms/dynamic-form-field-component';

@Component({
  selector: 'gtrack-form-field',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class DynamicFormFieldComponent extends NativeDynamicFormFieldComponent {}
