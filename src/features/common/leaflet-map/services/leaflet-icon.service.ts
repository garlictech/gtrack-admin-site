import * as L from 'leaflet';

import { Injectable } from '@angular/core';
import { EIconStyle, MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';

@Injectable({
  providedIn: 'root'
})
export class LeafletIconService {
  constructor(private readonly _markerIconsService: MarkerIconsService) {}

  getLeafletIcon(types: Array<string> | string = '', iconStyle: EIconStyle = EIconStyle.DEFAULT): L.Icon {
    let type: string;
    let typeArray: Array<string>;

    typeArray = !(types instanceof Array) ? [types] : [...types];
    type = typeArray[0] || 'unknown';

    return L.icon({
      iconUrl: this._markerIconsService.getMarker(type, true, iconStyle),
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    });
  }
}
