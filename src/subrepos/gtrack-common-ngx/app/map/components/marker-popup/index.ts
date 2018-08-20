import { Component } from '@angular/core';

@Component({
  selector: 'gc-marker-popup',
  templateUrl: './ui.html',
})
export class MarkerPopupComponent {
  public static componentName = 'MarkerPopupComponent';
  public data: any; // Poi data, callback methods, etc...
  public closePopup: any; // Popup close method
}
