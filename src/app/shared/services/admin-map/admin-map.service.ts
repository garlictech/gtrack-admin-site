import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { adminMapActions } from '../../../store/actions';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import { AdminMap } from './lib/admin-map';
import {
  IconService, MapMarkerService, MapService, MarkerPopupService, DescriptionLanguageListService
} from 'subrepos/gtrack-common-ngx/app';

import * as uuid from 'uuid/v1';
import _assign from 'lodash-es/assign';
import turfBuffer from '@turf/buffer';
import { Observable } from 'rxjs';
import { take, map as rxMap } from 'rxjs/operators';
import { SMALL_BUFFER_SIZE, BIG_BUFFER_SIZE } from 'app/config';
import { GeoJsonObject } from 'geojson';

export enum EBufferSize {
  SMALL = 'small',
  BIG = 'big'
}
export enum EAdminMarkerType {
  WAYPOINT = 'waypoint',
  POI = 'poi',
  IMAGE = 'image'
}

@Injectable()
export class AdminMapService extends MapService {
  protected _maps: { [id: string]: AdminMap } = {};

  constructor(
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    protected store: Store<State>,
    protected _descriptionLanguageList: DescriptionLanguageListService,
    protected _markerPopup: MarkerPopupService
  ) {
    super(iconService, mapMarkerService, store, _descriptionLanguageList, _markerPopup);
  }

  // TODO Remove
  public get(leafletMap: L.Map): AdminMap {
    const _id = uuid();
    const _map = new AdminMap(
      _id,
      leafletMap,
      this.iconService,
      this.mapMarkerService,
      this.store,
      this._descriptionLanguageList,
      this._markerPopup
    );
    this._maps[_id] = _map;

    this.store.dispatch(new adminMapActions.RegisterMap(_id));

    return _map;
  }

  // TODO remove
  getMapById(id: string) {
    return this._maps[id];
  }

  // NEW METHODS

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
          const _size = size === EBufferSize.SMALL ? SMALL_BUFFER_SIZE : BIG_BUFFER_SIZE;
          const _draw_type = size === EBufferSize.SMALL ? 'small_buffer' : 'big_buffer';

          let _buffer = turfBuffer(path, _size, { units: 'meters' });

          if (typeof _buffer !== 'undefined') {
            _buffer = _assign(_buffer, {
              properties: {
                name: 'buffer polygon',
                draw_type: _draw_type
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
