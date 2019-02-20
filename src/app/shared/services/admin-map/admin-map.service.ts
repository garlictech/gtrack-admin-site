import { BIG_BUFFER_SIZE, SMALL_BUFFER_SIZE } from 'app/config';
import { State } from 'app/store';
import { GeoJsonObject } from 'geojson';
import _assign from 'lodash-es/assign';
import { Observable } from 'rxjs';
import { map as rxMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import turfBuffer from '@turf/buffer';

import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';

export enum EBufferSize {
  SMALL = 'small',
  BIG = 'big'
}

@Injectable()
export class AdminMapService {
  constructor(private readonly _store: Store<State>) {}

  /**
   * Get buffer geoJSON
   */
  getBuffer(size: EBufferSize): Observable<GeoJsonObject | undefined> {
    // Update totals on each segment update
    return this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getPath),
      take(1),
      rxMap(path => {
        if (typeof path !== 'undefined') {
          let _buffer = turfBuffer(path, size === EBufferSize.SMALL ? SMALL_BUFFER_SIZE : BIG_BUFFER_SIZE, {
            units: 'meters'
          });

          if (typeof _buffer !== 'undefined') {
            _buffer = _assign(_buffer, {
              properties: {
                name: 'Buffer polygon'
              }
            });
          }

          return _buffer;
        } else {
          return;
        }
      })
    );
  }
}
