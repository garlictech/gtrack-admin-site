import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../../../../provider-client';
<<<<<<< HEAD

import _get from 'lodash-es/get';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

@Component({
  selector: 'gtrack-hike-card',
  template: ''
})
export class HikeCardComponent {
  @Input()
  public hikeProgram: IHikeProgram;

  public get images(): string[] {
    let urls: string[] = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'card.url', ''));
    }

    return urls;
  }

  public get image(): string {
    let url = '';

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;
      const firstImage = imageUrls[0];

      url = _get(firstImage, 'card.url', '');
    }

    return url;
  }
}
