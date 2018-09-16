import { Component, Input } from '@angular/core';
import { IHikeProgram } from '../../../../../provider-client';
import * as _ from 'lodash';

@Component({
  selector: 'gtcn-hike-card',
  template: ''
})
export class HikeCardComponent {
  @Input()
  public hikeProgram: IHikeProgram;

  public get images(): string[] {
    let urls: string[] = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _.get(image, 'card.url', ''));
    }

    return urls;
  }

  public get image(): string {
    let url = '';

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;
      const firstImage = imageUrls[0];

      url = _.get(firstImage, 'card.url', '');
    }

    return url;
  }
}
