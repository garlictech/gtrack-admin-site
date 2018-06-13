import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-date-picker',
  template: ''
})
export class DatePickerComponent extends AbstractValueAccessor {
  @Input() maxDate;
  @Input() minDate;
  @Input() defaultDate;
  @Input() placeholder;

  constructor() {
    super();
    this._value = typeof this.defaultDate === 'string' ? new Date(<string>this.defaultDate) : this.value;
  }

  writeValue(value: Date | string) {
    this._value = typeof value === 'string' ? new Date(<string>value) : value;
    this.onChange(value);
  }

  get currentYear() {
    return new Date().getFullYear();
  }
}
