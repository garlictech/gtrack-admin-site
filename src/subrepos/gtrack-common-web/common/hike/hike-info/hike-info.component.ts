import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { HikeInfoComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-hike-info',
  templateUrl: './hike-info.component.html',
  styleUrls: ['./hike-info.component.scss']
})
export class HikeInfoComponent extends BaseComponent {

}
