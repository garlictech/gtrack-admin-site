import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { ElevationProfileComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-elevation-profile',
  templateUrl: './elevation-profile.component.html',
  styleUrls: ['./elevation-profile.component.scss']
})
export class ElevationProfileComponent extends BaseComponent {}
