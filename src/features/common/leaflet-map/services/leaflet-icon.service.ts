import * as L from 'leaflet';

import { Injectable } from '@angular/core';
import { EIconSource, EIconStyle, MarkerIconService } from '@bit/garlictech.angular-features.common.marker-icons';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class LeafletIconService {
  s;
  constructor(private readonly _store: Store<any>, private readonly _markerIconService: MarkerIconService) {}

  // TODO DEPRECATED
  url(type: string, iconSource: EIconSource = EIconSource.ICON, iconStyle: EIconStyle = EIconStyle.DEFAULT): string {
    const fileName = type === 'unknown' ? 'asterisco' : type; // bench -> picnic
    const svg = ''; // this._markerIconService.getInlineSvg(`/assets/${iconSource}`, fileName, iconStyle) as any;

    console.log('svg in LeafletIconService', svg);

    return svg;
  }

  // TODO DEPRECATED
  urls(
    types: Array<string>,
    iconSource: EIconSource = EIconSource.ICON,
    iconStyle: EIconStyle = EIconStyle.DEFAULT
  ): Array<string> {
    return types.map((type: string) => this.url(type, iconSource, iconStyle));
  }

  getLeafletIcon(types: Array<string> | string = '', iconStyle: EIconStyle = EIconStyle.DEFAULT): L.Icon {
    let type: string;
    let typeArray: Array<string>;

    typeArray = !(types instanceof Array) ? [types] : [...types];
    type = typeArray[0] || 'unknown';

    return L.icon({
      iconUrl: this._markerIconService.getMarker(type, true, iconStyle),
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    });
  }
}
