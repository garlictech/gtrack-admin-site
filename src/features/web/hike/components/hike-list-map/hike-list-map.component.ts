import { Component } from '@angular/core';

import { HikeListMapComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';

@Component({
  selector: 'gtrack-hike-list-map',
  templateUrl: './hike-list-map.component.html',
  styleUrls: ['./hike-list-map.component.scss']
})
export class HikeListMapComponent extends BaseComponent {}
