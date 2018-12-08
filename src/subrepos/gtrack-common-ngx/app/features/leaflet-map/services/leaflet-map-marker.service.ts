import { Injectable } from '@angular/core';

import { LeafletIconService } from './leaflet-icon.service';
import { ILeafletMarkerPopupData } from '../interfaces';
import { LeafletMapMarker } from './lib';

@Injectable()
export class LeafletMapMarkerService {
  constructor(
    private _leafletIconService: LeafletIconService
  ) {}

  create(
    lat: number,
    lon: number,
    types: string[],
    title: string,
    additionalData: any = null,
    popupData: ILeafletMarkerPopupData = null
  ) {
    return new LeafletMapMarker(lat, lon, types, title, this._leafletIconService, additionalData, popupData);
  }
}
