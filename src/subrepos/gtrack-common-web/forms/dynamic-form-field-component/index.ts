import { Component } from '@angular/core';

import { DynamicFormFieldComponent as NativeDynamicFormFieldComponent } from 'subrepos/forms-ngx';

@Component({
  selector: 'gtrack-form-field',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicFormFieldComponent extends NativeDynamicFormFieldComponent {}
