import { Component, Input } from '@angular/core';
import { TextualDescription } from '@features/common/gtrack-interfaces';

@Component({
  selector: 'gtrack-html-description',
  templateUrl: './html-description.component.html'
})
export class HtmlDescriptionComponent {
  @Input() localizedDescription;
  @Input() field: keyof TextualDescription;
}
