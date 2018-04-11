import { Component, Input, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractValueAccessor } from '../abstract-value-accessor';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  useExisting: forwardRef(() => SwitchComponent),
  // tslint:enable no-forward-ref
  multi: true
};

@Component({
  selector: 'app-form-switch',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SwitchComponent extends AbstractValueAccessor {
  constructor() {
    super()
  }
}
