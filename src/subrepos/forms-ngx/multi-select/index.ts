import { Component, Input, Provider } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-multi-select',
  template: ''
})
export class MultiSelectComponent extends AbstractValueAccessor {
  @Input()
  options;

  defaultLabel: string;

  constructor() {
    super();
  }
}
