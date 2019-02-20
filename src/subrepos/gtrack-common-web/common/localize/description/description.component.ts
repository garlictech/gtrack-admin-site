import { Component } from '@angular/core';
import { ETextualDescriptionType } from '@features/common/gtrack-interfaces';
import { DescriptionComponent as BaseComponent } from '@features/common/multi-language-text';

@Component({
  selector: 'gtrack-description',
  templateUrl: './description.component.html'
})
export class DescriptionComponent extends BaseComponent {
  eTextualDescriptionType;

  constructor() {
    super();
    this.eTextualDescriptionType = ETextualDescriptionType;
  }
}
