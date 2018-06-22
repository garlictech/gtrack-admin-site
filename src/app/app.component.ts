import { Component, OnInit } from '@angular/core';
import { load } from 'webfontloader';
import { ToasterConfig, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
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
