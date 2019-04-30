import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Poi } from '@bit/garlictech.angular-features.common.poi';
import _get from 'lodash-es/get';

@Component({
  selector: 'gtrack-poi-page',
  templateUrl: './poi-page.component.html',
  styleUrls: ['./poi-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoiPageComponent {
  @Input() poi: Poi;

  get images(): Array<string> {
    let urls: Array<string> = [];

    if (this.poi && this.poi.backgroundImages instanceof Array) {
      const imageUrls = this.poi.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'original.url', ''));
    }

    return urls;
  }
}
