import { Component } from '@angular/core';
import { HikeInfoComponent as BaseComponent } from '@bit/garlictech.angular-features.common.hike';

@Component({
  selector: 'gtrack-hike-info',
  templateUrl: './hike-info.component.html',
  styleUrls: ['./hike-info.component.scss']
})
export class HikeInfoComponent extends BaseComponent {}
