import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-html-description',
  templateUrl: './html-description.component.html'
})
export class HtmlDescriptionComponent {
  @Input() localizedDescription;
}
