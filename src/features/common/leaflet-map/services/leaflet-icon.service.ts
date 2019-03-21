import { Injectable } from '@angular/core';
import * as L from 'leaflet';

import { MarkerIconService } from '@bit/garlictech.angular-features.common.marker-icons/services';
import { iconmap } from '../assets/icon';

@Injectable({
  providedIn: 'root'
})
export class LeafletIconService {
  protected iconMap: any;

  constructor(private readonly _markerIconService: MarkerIconService) {
    this.iconMap = iconmap;
  }

  url(type: string, iconType = 'default'): any {
    const baseUrl = `/assets/poi-icons/${iconType}`;
    const fileName = this.iconMap[type] || this.iconMap.unknown;

    console.log('LEafletIconService', `${baseUrl}/${fileName}`);
    this._markerIconService.getInlineSvg(`${baseUrl}/${fileName}`);

    return `${baseUrl}/${fileName}`;
  }

  urls(types: Array<string>, iconType = 'default'): Array<string> {
    return types.map(type => this.url(type, iconType));
  }

  getLeafletIcon(types: Array<string> | string = '', iconType = 'default'): L.Icon {
    let type: string;
    let typeArray: Array<string>;

    typeArray = !(types instanceof Array) ? [types] : [...types];
    type = typeArray[0] || 'unknown';

    return L.icon({
      iconUrl: this.url(type, iconType),
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    });
  }
}
