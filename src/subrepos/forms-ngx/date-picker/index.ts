import { Component, Input, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractValueAccessor } from '../abstract-value-accessor';
import { DebugLog, log } from '../../log';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable no-forward-ref
  useExisting: forwardRef(() => DatePickerComponent),
  // tslint:enable no-forward-ref
  multi: true
};

@Component({
  selector: 'app-form-date-picker',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DatePickerComponent extends AbstractValueAccessor {
  @Input() maxDate;
  @Input() defaultDate;

  constructor() {
    super()
    this._value = typeof this.defaultDate === 'string' ? new Date(<string>this.defaultDate) : this.value;
  }

  writeValue(value: Date | string) {
    this._value = typeof value === 'string' ? new Date(<string>value) : value;
    this.onChange(value);
  }
}
