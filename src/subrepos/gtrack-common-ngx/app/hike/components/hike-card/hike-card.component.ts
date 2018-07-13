import { Component, Input } from '@angular/core';
import { IHikeProgram, IBackgroundImageData } from '../../../../../provider-client';
import * as _ from 'lodash';

@Component({
  selector: 'gtcn-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent {
  @Input() public hikeProgram: IHikeProgram;

  public get image(): string {
    let url = '';

    if (this.hikeProgram && (this.hikeProgram.backgroundImages instanceof Array)) {
      let imageUrls = this.hikeProgram.backgroundImages;
      let firstImage = imageUrls[0];

      url = _.get(firstImage, 'card.url', '');
    }

    return url;
  }
}
