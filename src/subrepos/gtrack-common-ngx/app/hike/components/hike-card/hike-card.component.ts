import { Component, Input } from '@angular/core';
import { IHikeProgram, IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'gtcn-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent {
  @Input() public hikeProgram: IHikeProgram;

  public get image(): string {
    let url = '';

    if (this.hikeProgram && this.hikeProgram.backgroundImages) {
      let imageUrls = this.hikeProgram.backgroundImages || [];
      let firstImage = imageUrls[0] || {};
      url = (<IBackgroundImageData>firstImage).card.url || '';
    }

    return url;
  }
}
