import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Poi } from 'subrepos/gtrack-common-ngx';

<<<<<<< HEAD
import _get from 'lodash-es/get';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

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

<<<<<<< HEAD
      urls = imageUrls.map(image => _get(image, 'original.url', ''));
=======
      urls = imageUrls.map(image => _.get(image, 'original.url', ''));
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
    }

    return urls;
  }
}
