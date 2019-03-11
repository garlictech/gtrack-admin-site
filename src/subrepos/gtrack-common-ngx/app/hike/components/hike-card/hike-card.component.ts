import { Component, Input } from '@angular/core';
import { HikeProgramData } from '@features/common/gtrack-interfaces';
import _get from 'lodash-es/get';

@Component({
  selector: 'gtrack-common-hike-card',
  template: ''
})
export class HikeCardComponent {
  @Input() hikeProgram: HikeProgramData;

  get images(): Array<string> {
    let urls: Array<string> = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'card.url', ''));
    }

    return urls;
  }

  get image(): string {
    let url = '';

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;
      const firstImage = imageUrls[0];

      url = _get(firstImage, 'card.url', '');
    }

    return url;
  }
}
