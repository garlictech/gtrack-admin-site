import { Component, Input } from '@angular/core';

import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-radio-select',
  template: ''
})
export class RadioSelectComponent extends AbstractValueAccessor {
  @Input() options;

  constructor() {
    super();
  }
}
