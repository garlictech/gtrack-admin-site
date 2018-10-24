import { Component, ViewEncapsulation } from '@angular/core';

import { DynamicFormComponent as NativeDynamicFormComponent } from 'subrepos/forms-ngx';

@Component({
  selector: 'gtrack-form',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent extends NativeDynamicFormComponent {}
