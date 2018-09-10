import { Component, OnInit } from '@angular/core';
import { ToasterConfig, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public toasterConfig: ToasterConfig = new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 5000,
    bodyOutputType: BodyOutputType.TrustedHtml
  });
}
