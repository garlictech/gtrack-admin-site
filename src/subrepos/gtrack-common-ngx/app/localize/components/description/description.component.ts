import { Component, Input } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

@Component({
  selector: 'gtcn-description',
  template: ''
})
export class DescriptionComponent {
  @Input()
  public description: ILocalizedItem<ITextualDescription>;
}
