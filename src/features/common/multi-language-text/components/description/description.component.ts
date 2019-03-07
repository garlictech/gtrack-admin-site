import { Component, Input } from '@angular/core';
import { LocalizedItem, TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  selector: 'gtrack-common-description',
  template: ''
})
export class DescriptionComponent {
  @Input() description: LocalizedItem<TextualDescription>;
  @Input() showTitle: boolean;

  constructor() {
    this.showTitle = false;
  }
}
