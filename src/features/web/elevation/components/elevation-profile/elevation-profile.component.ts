import { Component } from '@angular/core';

import { ElevationProfileComponent as BaseComponent } from '@features/common/elevation';

@Component({
  selector: 'gtrack-elevation-profile',
  templateUrl: './elevation-profile.component.html',
  styleUrls: ['./elevation-profile.component.scss']
})
export class ElevationProfileComponent extends BaseComponent {}
