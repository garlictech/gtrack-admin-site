import { Component } from '@angular/core';

import { HikeDataItemComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';

@Component({
  selector: 'gtrack-hike-data-item',
  templateUrl: './hike-data-item.component.html',
  styleUrls: ['./hike-data-item.component.scss']
})
export class HikeDataItemComponent extends BaseComponent {}
