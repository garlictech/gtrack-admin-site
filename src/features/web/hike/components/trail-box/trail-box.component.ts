import { Component } from '@angular/core';

import { TrailBoxComponent as BaseComponent } from '@features/common/hike';

@Component({
  selector: 'gtrack-trail-box',
  templateUrl: './trail-box.component.html',
  styleUrls: ['./trail-box.component.scss']
})
export class TrailBoxComponent extends BaseComponent {}
