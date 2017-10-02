import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'gtrack-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    $.material.options.autofill = true;
    $.material.init();
  }
}
