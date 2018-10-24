import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { HikeProgram } from 'subrepos/gtrack-common-ngx';

import _get from 'lodash-es/get';

@Component({
  selector: 'gtrack-hike-program-page',
  templateUrl: './hike-program-page.component.html',
  styleUrls: ['./hike-program-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HikeProgramPageComponent {
  @Input()
  public hikeProgram: HikeProgram;

  public get images() {
    let urls: string[] = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'original.url', ''));
    }

    return urls;
  }
}
