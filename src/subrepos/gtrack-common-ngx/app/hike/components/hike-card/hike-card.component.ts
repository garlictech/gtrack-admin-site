import { Component, Input } from '@angular/core';
import { IHikeProgram, IHikeProgramBackgroundImage } from 'subrepos/provider-client';

@Component({
  selector: 'gtcn-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent {
  @Input()
  public hikeProgram: IHikeProgram;

  public get image(): string {
    let url = '';

    if (this.hikeProgram && this.hikeProgram.backgroundImageUrls) {
      let imageUrls = this.hikeProgram.backgroundImageUrls || [];
      let firstImage = imageUrls[0] || {};
      url = (<IHikeProgramBackgroundImage>firstImage).url || '';
    }

    return url;
  }
}
