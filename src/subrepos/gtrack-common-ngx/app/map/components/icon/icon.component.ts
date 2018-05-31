import { Component, Input } from '@angular/core';
import { IconService } from '../../services/icon';
import { Poi } from '../../../hike/services/poi';

@Component({
  selector: 'gtcn-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  public urls: string[] = [];

  private _poi: Poi;

  @Input()
  public set poi(poi: Poi) {
    if (poi && poi.types instanceof Array) {
      this._poi = poi;
      this.urls = this.iconService.urls(poi.types);
    }
  }

  constructor(private iconService: IconService) {}
}
