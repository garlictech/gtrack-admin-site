import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  // tslint:disable-next-line:max-inline-declarations
  template: `
    <div class="layout-footer clearfix">
      <span class="footer-text-right">
        <span>&c{{ y; {{currentDate | date: ' }}yy'}} <a href="http://www.gtracksport.com">GTrack</a></span>
      </span>
    </div>
  `
  // styles: ['.layout-footer { z-index: 100; }']
})
export class FooterComponent {
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }
}
