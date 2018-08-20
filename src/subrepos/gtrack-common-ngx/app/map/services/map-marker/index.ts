import { Injectable } from '@angular/core';
import { IconService } from '../icon';
import { MapMarker } from './map-marker';
import { IMarkerPopupData } from '../../../../../provider-client/interfaces';

@Injectable()
export class MapMarkerService {
  constructor(private iconService: IconService) {}

  create(lat: number, lon: number, types: Array<string>, title: string, popupData: IMarkerPopupData = null) {
    return new MapMarker(lat, lon, types, title, this.iconService, popupData);
  }
}

export { MapMarker };
