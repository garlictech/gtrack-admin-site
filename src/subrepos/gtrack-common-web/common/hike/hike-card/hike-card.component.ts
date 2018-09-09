import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { HikeCardComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.component.scss']
})
export class HikeCardComponent extends BaseComponent {}
