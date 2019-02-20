import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-time-picker',
  template: ''
})
export class TimePickerComponent extends AbstractValueAccessor {
  @Input() maxDate;
  @Input() minDate;
  @Input() defaultDate;
  @Input() placeholder;

  constructor() {
    super();
    this._value = typeof this.defaultDate === 'string' ? new Date(this.defaultDate) : this.value;
  }

  writeValue(value: Date | string): void {
    this._value = typeof value === 'string' ? new Date(value) : value;
    this.onChange(value);
  }
}
