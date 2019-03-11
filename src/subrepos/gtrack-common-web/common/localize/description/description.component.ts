import { Component, Input } from '@angular/core';
import { ETextualDescriptionType, TextualDescription } from '@features/common/gtrack-interfaces';
import { DescriptionComponent as BaseComponent } from '@features/common/multi-language-text';

@Component({
  selector: 'gtrack-description',
  templateUrl: './description.component.html'
})
export class DescriptionComponent extends BaseComponent {
  eTextualDescriptionType;

  @Input() field: keyof TextualDescription;

  constructor() {
    super();
    this.field = 'fullDescription';
    this.eTextualDescriptionType = ETextualDescriptionType;
  }
}
