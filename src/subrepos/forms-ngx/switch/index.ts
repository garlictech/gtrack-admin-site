import { Component, Input } from '@angular/core';

import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-switch',
  template: ''
})
export class SwitchComponent extends AbstractValueAccessor {
  constructor() {
    super();
  }
}
