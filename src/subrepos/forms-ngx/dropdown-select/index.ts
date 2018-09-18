import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-dropdown-select',
  template: ''
})
export class DropdownSelectComponent extends AbstractValueAccessor {
  @Input()
  options;
}
