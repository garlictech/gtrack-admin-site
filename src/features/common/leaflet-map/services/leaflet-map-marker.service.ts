import { Injectable } from '@angular/core';

import { LeafletMarkerPopupData } from '../interfaces';
import { LeafletIconService } from './leaflet-icon.service';
import { LeafletMapMarker } from './lib';

@Injectable({
  providedIn: 'root'
})
export class LeafletMapMarkerService {
  constructor(private readonly _leafletIconService: LeafletIconService) {}

  create(
    lat: number,
    lon: number,
    types: Array<string>,
    title: string,
    additionalData?: any,
    popupData?: LeafletMarkerPopupData
  ): LeafletMapMarker {
    return new LeafletMapMarker(lat, lon, types, title, this._leafletIconService, additionalData, popupData);
  }
}
