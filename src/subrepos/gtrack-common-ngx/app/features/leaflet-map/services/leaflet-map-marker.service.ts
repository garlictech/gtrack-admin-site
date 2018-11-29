import { Injectable } from '@angular/core';

import { LeafletIconService } from './leaflet-icon.service';
import { ILeafletMarkerPopupData } from '../interfaces';
import { LeafletMapMarker } from './lib';

@Injectable()
export class LeafletMapMarkerService {
  constructor(private iconService: LeafletIconService) {}

  create(lat: number, lon: number, types: Array<string>, title: string, popupData: ILeafletMarkerPopupData = null) {
    return new LeafletMapMarker(lat, lon, types, title, this.iconService, popupData);
  }
}
