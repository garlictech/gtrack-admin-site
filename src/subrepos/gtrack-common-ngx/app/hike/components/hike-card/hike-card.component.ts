import { Component, Input } from '@angular/core';
import { IHike } from '../../services/hike';

@Component({
  selector: 'gtcn-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent {
  @Input()
  public hike: IHike;

  public get image(): string {
    let url = '';

    if (this.hike && this.hike.backgroundImageUrls) {
      let imageUrls = this.hike.backgroundImageUrls || [];
      let firstImage = imageUrls[0] || {};
      url = firstImage.url || '';
    }

    return url;
  }
}
