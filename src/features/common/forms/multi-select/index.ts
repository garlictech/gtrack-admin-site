import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-native-form-multi-select',
  template: ''
})
export class MultiSelectComponent extends AbstractValueAccessor {
  @Input() options;
  @Input() defaultLabel: string;

  constructor() {
    super();
  }
}
