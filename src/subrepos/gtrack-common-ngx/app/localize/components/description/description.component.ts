import { Component, Input } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

@Component({
  selector: 'gtrack-common-description',
  template: ''
})
export class DescriptionComponent {
  @Input()
  public description: ILocalizedItem<ITextualDescription>;
}
