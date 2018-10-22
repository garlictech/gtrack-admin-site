import { MarkerPopupComponent as BaseComponent } from 'subrepos/gtrack-common-ngx/app/map/components/marker-popup';
import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss']
})
export class MarkerPopupComponent extends BaseComponent {
  public showPopup = false;
}
