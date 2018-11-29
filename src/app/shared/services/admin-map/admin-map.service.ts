import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map as rxMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State } from 'app/store';
import { SMALL_BUFFER_SIZE, BIG_BUFFER_SIZE } from 'app/config';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';

import _assign from 'lodash-es/assign';
import turfBuffer from '@turf/buffer';
import { GeoJsonObject } from 'geojson';

export enum EBufferSize {
  SMALL = 'small',
  BIG = 'big'
}

@Injectable()
export class AdminMapService {
  constructor(
    private _store: Store<State>,
  ) { }

  /**
   * Get buffer geoJSON
   */
  public getBuffer(size: EBufferSize): Observable<GeoJsonObject | undefined> {
    // Update totals on each segment update
    return this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getPath),
      take(1),
      rxMap(path => {
        if (typeof path !== 'undefined') {
          let _buffer = turfBuffer(path, (size === EBufferSize.SMALL ? SMALL_BUFFER_SIZE : BIG_BUFFER_SIZE), { units: 'meters' });

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
