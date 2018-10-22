import { IPoi, IHikeProgramStop } from 'subrepos/provider-client';

import _get from 'lodash-es/get';

export class MarkerPopupComponent {
  public static componentName = 'MarkerPopupComponent';

  public data: {
    poi: IPoi;
    stop: IHikeProgramStop;
  };

  public closePopup: any; // Popup close method

  public get image(): string {
    let url = '';

    if (this.data && this.data.poi && this.data.poi.backgroundImages instanceof Array) {
      const imageUrls = this.data.poi.backgroundImages;
      const firstImage = imageUrls[0];

      url = _get(firstImage, 'card.url', '');
    }

    return url;
  }
}
