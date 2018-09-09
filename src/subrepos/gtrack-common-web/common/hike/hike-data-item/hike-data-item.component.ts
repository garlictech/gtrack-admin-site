import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { HikeDataItemComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-hike-data-item',
  templateUrl: './hike-data-item.component.html',
  styleUrls: ['./hike-data-item.component.scss']
})
export class HikeDataItemComponent extends BaseComponent {}
