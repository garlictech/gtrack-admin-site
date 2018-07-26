import { Component } from '@angular/core';

import { DynamicFormSectionComponent as NativeDynamicFormSectionComponent } from 'subrepos/forms-ngx';

@Component({
  selector: 'gtrack-form-section',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class DynamicFormSectionComponent extends NativeDynamicFormSectionComponent {}
