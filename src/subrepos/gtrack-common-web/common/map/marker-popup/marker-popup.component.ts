import { Component } from '@angular/core';
import { MarkerPopupComponent as BaseComponent } from 'subrepos/gtrack-common-ngx/app/map/components/marker-popup';

@Component({
  selector: 'gtrack-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss']
})
export class MarkerPopupComponent extends BaseComponent {
  showPopup: boolean;

  constructor() {
    super();
    this.showPopup = false;
  }
}
