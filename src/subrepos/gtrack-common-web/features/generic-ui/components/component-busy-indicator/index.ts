import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'garlictech-component-busy-indicator',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentBusyIndicatorComponent {
  @Input()
  containerClass?: Array<string>;
  @Input()
  text = '';
  faSpinner = faSpinner;

  containerClassList(): Array<string> {
    return ['loader-wrapper', ...(this.containerClass || [])];
  }
}
