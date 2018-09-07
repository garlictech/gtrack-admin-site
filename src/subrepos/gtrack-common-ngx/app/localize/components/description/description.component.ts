import { Component, Input } from '@angular/core';
import { ILocalizedItem, ITextualDescription } from '../../../../../provider-client';

@Component({
  selector: 'gtcn-description',
  templateUrl: './description.component.html'
})
export class DescriptionComponent {
  @Input()
  public description: ILocalizedItem<ITextualDescription>;
}
