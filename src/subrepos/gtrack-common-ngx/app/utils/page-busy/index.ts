import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-busy',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class PageBusyComponent {
  @Input() containerClass?: Array<string>;
  @Input() text = '';
  @Input() big = true;

  containerClassList(): Array<string> {
    return ['loader-wrapper', ...(this.containerClass ? this.containerClass : [])];
  }
}
