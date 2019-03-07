import { Injectable } from '@angular/core';
import * as L from 'leaflet';

import { iconmap } from '../assets/icon';

@Injectable({
  providedIn: 'root'
})
export class LeafletIconService {
  protected iconMap: any;

  constructor() {
    this.iconMap = iconmap;
  }

  url(type: string, iconType = 'default'): any {
    const baseUrl = `/assets/poi-icons/${iconType}`;
    const fileName = this.iconMap[type] || this.iconMap.unknown;

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
