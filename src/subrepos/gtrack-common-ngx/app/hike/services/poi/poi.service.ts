import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Poi } from './poi';
import { IPoi, IPoiStored, IPoiInput, IPoiSaveResponse } from 'subrepos/provider-client';

import { DeepstreamService } from 'subrepos/deepstream-ngx';

import * as _ from 'lodash';

import 'rxjs/add/operator/take';

@Injectable()
export class PoiService {
  constructor(
    private _deepstream: DeepstreamService
  ) { }

  public get(id: string): Observable<Poi> {
    return this._deepstream
      .getRecord<IPoiStored>(`pois/${id}`)
      .get()
      .map(data => {
        let poi = new Poi(data);

        return poi;
      });
  }

  public search(bounds): Observable<any[]> {
    return Observable.of([]);
  }

  public create(poi: IPoi) {
    return this._deepstream.callRpc<IPoiSaveResponse>('admin.poi.save', poi);
  }
}
