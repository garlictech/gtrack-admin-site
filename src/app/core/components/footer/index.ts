import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="layout-footer clearfix">
      <span class="footer-text-right">
        <span>&copy; {{currentDate | date: 'yyyy'}} <a href="http://www.gtracksport.com">GTrack</a></span>
      </span>
    </div>
  `
})
export class FooterComponent implements OnInit {
  public currentDate: Date;

  ngOnInit() {
    this.currentDate = new Date();
  }
}
