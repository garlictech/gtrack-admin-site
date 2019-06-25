import { HikeDataPopupComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';

import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-hike-data-popup',
  templateUrl: './hike-data-popup.component.html',
  styleUrls: ['./hike-data-popup.component.scss']
})
export class HikeDataPopupComponent extends BaseComponent {
  showPopup: boolean;

  constructor() {
    super();
    this.showPopup = false;
  }
}
