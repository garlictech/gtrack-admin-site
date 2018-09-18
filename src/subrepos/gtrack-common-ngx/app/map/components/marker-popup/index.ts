import { Component } from '@angular/core';
import { IPoi, IHikeProgramStop } from 'subrepos/provider-client';

import _get from 'lodash-es/get';

@Component({
<<<<<<< HEAD
  selector: 'gtrack-marker-popup',
=======
  selector: 'gtcn-marker-popup',
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
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
