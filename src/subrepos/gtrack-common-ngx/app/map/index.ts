import { Injectable } from '@angular/core';
import { Map } from './map';
import { CurrentPositionMarker } from './current-position-marker';
import { CheckpointMarker } from './checkpoint-marker';
import { IconService } from '../icon';
import { MapMarkerService } from '../map-marker';

@Injectable()
export class MapService {

  constructor(protected iconService: IconService, protected mapMarkerService: MapMarkerService) { }

  get(map: L.Map): Map {
    return new Map(map, this.iconService, this.mapMarkerService);
  }
}

export {
  Map,
  CurrentPositionMarker,
  CheckpointMarker
};
