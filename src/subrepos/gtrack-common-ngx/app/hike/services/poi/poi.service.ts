import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoi, IPoiStored, IPoiSaveResponse, EObjectState } from '../../../../../provider-client';

import { DeepstreamService } from '../../../../../deepstream-ngx';

import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable()
export class PoiService {
  constructor(private _deepstream: DeepstreamService) {}

  public get(id: string): Observable<IPoiStored> {
    return this._deepstream
      .getRecord<IPoiStored>(`pois/${id}`)
      .get()
      .pipe(
        take(1),
        map(data => {
          return _cloneDeep(data);
        })
      );
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
      .pipe(take(1));
  }

  public delete(id: string) {
    return this._deepstream
      .callRpc('admin.delete', {
        id: id,
        table: 'pois'
      })
      .pipe(take(1));
  }

  public merge(ids: string[], newData: IPoi) {
    return this._deepstream
      .callRpc('admin.poi.merge', {
        ids: ids,
        newData: newData
      })
      .pipe(take(1));
  }
}
