import { Component, ViewEncapsulation } from '@angular/core';

import { DynamicFormFieldComponent as NativeDynamicFormFieldComponent } from 'subrepos/forms-ngx/dynamic-form-field-component';

@Component({
  selector: 'gtrack-form-field',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormFieldComponent extends NativeDynamicFormFieldComponent {}
