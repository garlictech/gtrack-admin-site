import { Component, Input } from '@angular/core';
import { TextualDescription } from '@features/common/gtrack-interfaces';

@Component({
  selector: 'gtrack-markdown-description',
  templateUrl: './markdown-description.component.html'
})
export class MarkdownDescriptionComponent {
  @Input() localizedDescription: TextualDescription;
  @Input() field: keyof TextualDescription;
}