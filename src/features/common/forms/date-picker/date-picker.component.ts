import { Component, Input, OnInit } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-date-picker',
  template: ''
})
export class DatePickerComponent extends AbstractValueAccessor implements OnInit {
  @Input() maxDate;
  @Input() minDate;
  @Input() defaultDate;
  @Input() placeholder;
  @Input() showTime;

  constructor() {
    super();

    this.onChange = (value: string | Date): void => {
      this.value = typeof value === 'string' ? new Date(value) : value;
    };
  }

  ngOnInit(): void {
    this._value = typeof this.defaultDate === 'string' ? new Date(this.defaultDate) : this.defaultDate;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
