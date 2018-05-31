import { Injectable } from '@angular/core';
import { IconService } from '../icon';
import { MapMarker } from './map-marker';

@Injectable()
export class MapMarkerService {
  constructor(private iconService: IconService) {}

  create(lat: number, lon: number, types: Array<string>, title: string) {
    return new MapMarker(lat, lon, types, title, this.iconService);
  }
}

export { MapMarker };
