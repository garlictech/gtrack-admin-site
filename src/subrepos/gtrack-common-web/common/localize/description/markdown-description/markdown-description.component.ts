import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-markdown-description',
  templateUrl: './markdown-description.component.html'
})
export class MarkdownDescriptionComponent {
  @Input() localizedDescription;
}
