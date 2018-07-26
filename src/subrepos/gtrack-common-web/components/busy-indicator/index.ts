import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-busy-indicator',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class BusyIndicatorComponent {
  @Input() containerClass?: Array<string>;
  @Input() text = '';
  @Input() big = false;

  containerClassList(): Array<string> {
    return ['loader-wrapper', ...(this.containerClass ? this.containerClass : [])];
  }
}
