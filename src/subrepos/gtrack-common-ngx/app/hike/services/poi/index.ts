import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Poi } from './poi';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';

import 'rxjs/add/operator/take';

@Injectable()
export class PoiService {
  constructor(private _deepstream: DeepstreamService) { }

  get(id: string): Observable<Poi> {
    return this._deepstream
      .getRecord(`pois/${id}`)
      .snapshot()
      .map((data: any) => {
        let poi: Poi = Object.assign(new Poi(data.id), data);

        return poi;
      });
  }

  public search(bounds): Observable<any[]> {
    return Observable.of([]);
  }
}

export { Poi };
export { IPoi } from './ipoi';
