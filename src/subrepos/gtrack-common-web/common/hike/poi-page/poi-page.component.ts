import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Poi } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';

@Component({
  selector: 'gtrack-poi-page',
  templateUrl: './poi-page.component.html',
  styleUrls: ['./poi-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PoiPageComponent {
  @Input()
  public poi: Poi;

  public get images() {
    let urls: string[] = [];

    if (this.poi && this.poi.backgroundImages instanceof Array) {
      const imageUrls = this.poi.backgroundImages;

      urls = imageUrls.map(image => _.get(image, 'original.url', ''));
    }

    return urls;
  }
}
