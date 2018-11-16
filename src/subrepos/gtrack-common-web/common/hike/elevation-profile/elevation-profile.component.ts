import { Component, ViewEncapsulation } from '@angular/core';

import { ElevationProfileComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-elevation-profile',
  templateUrl: './elevation-profile.component.html',
  styleUrls: ['./elevation-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ElevationProfileComponent extends BaseComponent {}
