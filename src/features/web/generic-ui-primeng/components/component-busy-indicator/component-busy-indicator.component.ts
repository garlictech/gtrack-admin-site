import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'garlictech-component-busy-indicator',
  templateUrl: './component-busy-indicator.component.html',
  styleUrls: ['./component-busy-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentBusyIndicatorComponent {
  @Input() containerClass?: Array<string>;
  @Input() text: string;
  faSpinner: IconDefinition;

  constructor() {
    this.text = '';
    this.faSpinner = faSpinner;
  }

  containerClassList(): Array<string> {
    return ['loader-wrapper', ...(this.containerClass || [])];
  }
}
