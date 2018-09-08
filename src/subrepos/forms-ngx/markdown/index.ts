import { Component, Input } from '@angular/core';

import { AbstractValueAccessor } from '../abstract-value-accessor';

@Component({
  selector: 'app-form-markdown',
  template: ''
})
export class MarkdownComponent extends AbstractValueAccessor {
  @Input()
  rows;
}
