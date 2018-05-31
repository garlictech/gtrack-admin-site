import { Injectable } from '@angular/core';
import * as L from 'leaflet';

import { iconmap as defaultIconmap } from './default';
import { iconmap as greyIconmap } from './grey';
import { iconmap as greenIconmap } from './green';
import { iconmap as highlightIconmap } from './highlight';
import { iconmap as redIconmap } from './red';

@Injectable()
export class IconService {
  protected iconMap = {
    default: defaultIconmap,
    grey: greyIconmap,
    green: greenIconmap,
    highlight: highlightIconmap,
    red: redIconmap
  };

  public url(type: string, iconType = 'default') {
    let icon = this.iconMap[iconType][type] || this.iconMap[iconType].unknown;

    return icon;
  }

  public urls(types: Array<string>, iconType = 'default'): string[] {
    return types.map(type => {
      return this.url(type, iconType);
    });
  }

  public getLeafletIcon(types: string[] | string = '', iconType = 'default') {
    let type: string;

    if (!(types instanceof Array)) {
      types = [types];
    }

    type = types[0] || 'unknown';

    return L.icon({
      iconUrl: this.url(type, iconType),
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    });
  }
}
