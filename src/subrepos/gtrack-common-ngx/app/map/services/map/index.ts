import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map } from './map';
import { CurrentPositionMarker } from './current-position-marker';
import { CheckpointMarker } from './checkpoint-marker';
import { IconService } from '../icon';
import { MapMarkerService } from '../map-marker';
import * as uuid from 'uuid';

@Injectable()
export class MapService {
  protected _maps: { [id: string]: Map } = {};

  constructor(protected iconService: IconService, protected mapMarkerService: MapMarkerService, protected store: Store<any>) {}

  get(leafletMap: L.Map): Map {
    const id = uuid();
    const map = new Map(id, leafletMap, this.iconService, this.mapMarkerService, this.store);
    this._maps[id] = map;
    return map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}

export { Map, CurrentPositionMarker, CheckpointMarker };
