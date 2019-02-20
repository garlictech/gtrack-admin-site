import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-native-form-chips',
  template: ''
})
export class ChipsComponent extends AbstractValueAccessor {
  @Input() placeholder;
}
