import { Component, Input } from '@angular/core';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';
import { Poi } from '@features/common/poi';

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
      this.urls = poi.types.map((type: string) => this._markerIconsService.getIcon(type, true));
    }
  }

  constructor(private readonly _markerIconsService: MarkerIconsService) {
    this.urls = [];
    this.width = 32;
  }

  trackByFn(index: number): number {
    return index;
  }
}
