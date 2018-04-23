import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IPoi, IPoiStored, IPoiInput, IPoiSaveResponse } from 'subrepos/provider-client';

import { DeepstreamService } from 'subrepos/deepstream-ngx';

import * as _ from 'lodash';

import 'rxjs/add/operator/take';
import { CenterRadius, GeometryService } from '../geometry';
import { GeoSearchService } from '../../../geosearch';

@Injectable()
export class PoiService {
  constructor(
    private _deepstream: DeepstreamService,
    private _geometryService: GeometryService,
    private _geoSearchService: GeoSearchService,
  ) { }

  public get(id: string): Observable<IPoi> {
    return this._deepstream
      .getRecord<IPoiStored>(`pois/${id}`)
      .get()
      .take(1)
      .map(data => {
        return _.cloneDeep(data);
      });
  }

  public search(bounds): Observable<IPoi[]> {
    let _geo: CenterRadius = this._geometryService.getCenterRadius(bounds);
    let _centerCoord = _geo!.center!.geometry!.coordinates;

    return this._geoSearchService
      .searchCircle({
        table: 'pois',
        circle: {
          radius: _geo.radius,
          center: [_centerCoord[0], _centerCoord[1]]
        }
      })
      .mergeMap((poiIds: string[]) => {
        if (poiIds.length > 0) {
          return Observable
            .combineLatest(...poiIds.map(poiId => {
              return this.get(poiId);
            }))
            .map(pois => {
              return pois;
            });
        } else {
          return Observable.of([]);
        }
      });
  }

  public create(poi: IPoi) {
    return this._deepstream.callRpc<IPoiSaveResponse>('admin.poi.save', poi);
  }
}
