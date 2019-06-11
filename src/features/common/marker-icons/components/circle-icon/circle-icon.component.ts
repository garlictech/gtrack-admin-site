import { Component, Input } from '@angular/core';
import { MarkerIconsService } from '../../services';

import { Poi } from '@bit/garlictech.angular-features.common.poi/lib/poi';

@Component({
  selector: 'gtrack-circle-icon',
  templateUrl: './circle-icon.component.html',
  styleUrls: ['./circle-icon.component.scss']
})
export class CircleIconComponent {
  url: string;

  @Input() width: number;

  @Input()
  set poi(poi: Poi) {
    if (poi && poi.types instanceof Array) {
      const type = poi.types[0];
      this.url = this._markerIconsService.getCircleMarker(type, true);
    }
  }

  constructor(private readonly _markerIconsService: MarkerIconsService) {
    this.url = '';
    this.width = 32;
  }

  trackByFn(index: number): number {
    return index;
  }
}
