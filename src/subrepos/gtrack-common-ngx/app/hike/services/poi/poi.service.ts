import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IPoi, IPoiStored, IPoiInput, IPoiSaveResponse, EObjectState } from 'subrepos/provider-client';

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
    private _geoSearchService: GeoSearchService
  ) {}

  public get(id: string): Observable<IPoiStored> {
    return this._deepstream
      .getRecord<IPoiStored>(`pois/${id}`)
      .get()
      .take(1)
      .map(data => {
        return _.cloneDeep(data);
      });
  }

  public create(poi: IPoi) {
    return this._deepstream.callRpc<IPoiSaveResponse>('admin.poi.save', poi);
  }

  public updateState(id: string, state: EObjectState) {
    return this._deepstream
      .callRpc('admin.state', {
        id: id,
        table: 'pois',
        state: state
      })
      .take(1);
  }

  public delete(id: string) {
    return this._deepstream
      .callRpc('admin.delete', {
        id: id,
        table: 'pois'
      })
      .take(1);
  }
}
