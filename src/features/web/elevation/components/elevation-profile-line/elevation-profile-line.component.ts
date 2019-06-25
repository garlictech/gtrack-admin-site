import { Component, ViewEncapsulation } from '@angular/core';
import { ElevationProfileLineComponent as BaseComponent } from '@bit/garlictech.angular-features.common.elevation';

@Component({
  selector: 'gtrack-elevation-profile-line',
  templateUrl: './elevation-profile-line.component.html',
  styleUrls: ['./elevation-profile-line.component.scss'],
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationProfileLineComponent extends BaseComponent {}
