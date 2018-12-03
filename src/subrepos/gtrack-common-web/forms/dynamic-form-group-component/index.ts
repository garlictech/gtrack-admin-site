import { Component } from '@angular/core';

import { DynamicFormGroupComponent as NativeDynamicFormGroupComponent } from 'subrepos/forms-ngx/dynamic-form-group-component';

@Component({
  selector: 'gtrack-form-group',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicFormGroupComponent extends NativeDynamicFormGroupComponent {}
