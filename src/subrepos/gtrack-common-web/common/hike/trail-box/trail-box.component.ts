import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { TrailBoxComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-trail-box',
  templateUrl: './trail-box.component.html',
  styleUrls: ['./trail-box.component.scss']
})
export class TrailBoxComponent extends BaseComponent {}
