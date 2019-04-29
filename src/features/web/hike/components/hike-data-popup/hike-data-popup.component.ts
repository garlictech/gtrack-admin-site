import { HikeDataPopupComponent as BaseComponent } from '@features/common/hike/components/hike-data-popup/hike-data-popup.component';

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
