import { Component, Input } from '@angular/core';
import { LeafletIconService } from '@bit/garlictech.angular-features.common.leaflet-map';

import { Poi } from '../../../hike/services/poi';

@Component({
  selector: 'gtrack-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  urls: Array<string>;

  @Input() width: number;

  @Input()
  set poi(poi: Poi) {
    if (poi && poi.types instanceof Array) {
      this.urls = this.iconService.urls(poi.types);
    }
  }

  constructor(private readonly iconService: LeafletIconService) {
    this.urls = [];
    this.width = 32;
  }

  trackByFn(index: number): number {
    return index;
  }
}
