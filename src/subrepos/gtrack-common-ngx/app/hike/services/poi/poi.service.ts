import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoi, IPoiStored, IPoiSaveResponse, EObjectState } from '../../../../../provider-client';

import { DeepstreamService } from '../../../../../deepstream-ngx';
<<<<<<< HEAD

import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable()
export class PoiService {
  constructor(private _deepstream: DeepstreamService) {}
=======
import * as _ from 'lodash';

@Injectable()
export class PoiService {
  constructor(
    private _deepstream: DeepstreamService
  ) {}
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

  public get(id: string): Observable<IPoiStored> {
    return this._deepstream
      .getRecord<IPoiStored>(`pois/${id}`)
      .get()
      .pipe(
        take(1),
        map(data => {
<<<<<<< HEAD
          return _cloneDeep(data);
=======
          return _.cloneDeep(data);
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
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
<<<<<<< HEAD
      .pipe(take(1));
=======
      .pipe(
        take(1)
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  public delete(id: string) {
    return this._deepstream
      .callRpc('admin.delete', {
        id: id,
        table: 'pois'
      })
<<<<<<< HEAD
      .pipe(take(1));
=======
      .pipe(
        take(1)
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  public merge(ids: string[], newData: IPoi) {
    return this._deepstream
      .callRpc('admin.poi.merge', {
        ids: ids,
        newData: newData
      })
<<<<<<< HEAD
      .pipe(take(1));
=======
      .pipe(
        take(1)
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }
}
