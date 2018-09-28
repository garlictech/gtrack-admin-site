import { Component, Input } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-busy-indicator',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class BusyIndicatorComponent {
  @Input()
  containerClass?: Array<string>;
  @Input()
  text = '';
  @Input()
  big = false;

  icon = faSpinner;

  containerClassList(): Array<string> {
    return ['loader-wrapper', ...(this.containerClass ? this.containerClass : [])];
  }
}
