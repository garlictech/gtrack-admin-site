import { Component } from '@angular/core';

import { DynamicFormGroupComponent as NativeDynamicFormGroupComponent } from 'subrepos/forms-ngx';

@Component({
  selector: 'gtrack-form-group',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicFormGroupComponent extends NativeDynamicFormGroupComponent {}
