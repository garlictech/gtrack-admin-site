import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SwitchComponent as NativeSwitchComponent } from 'subrepos/forms-ngx';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  // tslint:disable no-use-before-declare
  useExisting: forwardRef(() => SwitchComponent),
  // tslint:enable no-forward-ref
  // tslint:enable no-use-before-declare
  multi: true
};

@Component({
  selector: 'gtrack-form-switch',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SwitchComponent extends NativeSwitchComponent {}
