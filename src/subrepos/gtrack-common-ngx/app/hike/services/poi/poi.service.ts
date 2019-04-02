import { Injectable } from '@angular/core';
import {
  EObjectState,
  PoiData,
  PoiSaveResponse,
  PoiStored
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';

import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable()
export class PoiService {
  constructor(private readonly _deepstream: DeepstreamService) {}

  get(id: string): Observable<PoiStored> {
    return this._deepstream
      .getRecord<PoiStored>(`pois/${id}`)
      .get()
      .pipe(
        take(1),
        map(_cloneDeep)
      );
  }

  create(poi: PoiData): Observable<any> {
    return this._deepstream.callRpc<PoiSaveResponse>('admin.poi.save', poi);
  }

  updateState(id: string, state: EObjectState): Observable<any> {
    return this._deepstream
      .callRpc('admin.state', {
        id,
        table: 'pois',
        state
      })
      .pipe(take(1));
  }

  delete(id: string): Observable<any> {
    return this._deepstream
      .callRpc('admin.delete', {
        id,
        table: 'pois'
      })
      .pipe(take(1));
  }

  merge(ids: Array<string>, newData: PoiData): Observable<any> {
    return this._deepstream
      .callRpc('admin.poi.merge', {
        ids,
        newData
      })
      .pipe(take(1));
  }
}
