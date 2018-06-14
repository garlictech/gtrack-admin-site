import { Component, OnInit } from '@angular/core';
import { ToasterConfig, BodyOutputType } from 'angular2-toaster';
import { load } from 'webfontloader';

@Component({
  selector: 'gtrack-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public toasterConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 5000,
    bodyOutputType: BodyOutputType.TrustedHtml
  });

  ngOnInit() {
    load({ google: { families: ['Roboto:300,400,500,700,400italic', 'Material+Icons'] } });
  }
}
