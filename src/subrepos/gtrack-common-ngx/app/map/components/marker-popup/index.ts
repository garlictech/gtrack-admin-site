import { HikeProgramStop, PoiData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import _get from 'lodash-es/get';

export class MarkerPopupComponent {
  // tslint:disable-next-line:no-property-initializers
  static componentName = 'MarkerPopupComponent';

  data: {
    poi: PoiData;
    stop: HikeProgramStop;
  };

  closePopup: any; // Popup close method

  get image(): string {
    let url = '';

    if (this.data && this.data.poi && this.data.poi.backgroundImages instanceof Array) {
      const imageUrls = this.data.poi.backgroundImages;
      const firstImage = imageUrls[0];

      url = _get(firstImage, 'card.url', '');
    }

    return url;
  }
}
