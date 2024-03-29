import _get from 'lodash-es/get';

import { Component } from '@angular/core';

import { HikeProgram } from '../../lib';

@Component({
  selector: 'gtrack-common-hike-data-popup',
  template: ''
})
export class HikeDataPopupComponent {
  // tslint:disable-next-line:no-property-initializers
  static componentName = 'HikeDataPopupComponent';

  data: {
    hikeProgram: HikeProgram;
  };

  closePopup: any; // Popup close method

  get image(): string {
    let url = '';

    if (this.data && this.data.hikeProgram && this.data.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.data.hikeProgram.backgroundImages;
      const firstImage = imageUrls[0];

      url = _get(firstImage, 'card.url', '');
    }

    return url;
  }
}
