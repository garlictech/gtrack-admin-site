import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Hike } from './hike';
import { IHike } from './ihike';
import { HikeProgramService } from '../hike-program';
import { DeepstreamService } from '../../subrepos/deepstream-ngx';

@Injectable()
export class HikeService {

  constructor(private hikeProgramService: HikeProgramService, private _deepstream: DeepstreamService) { }

  get(id: string): Observable<Hike> {
    return this._deepstream
      .getRecord(id)
      .get()
      .switchMap((data: any) => {
        let hike: Hike = new Hike(data, this.hikeProgramService);

        return hike.load();
      })
      .catch((err: Error) => {
        console.warn(err);
        return Observable.of(null);
      });
  }

  query(): Observable<Hike[]> {
    return this._deepstream
      .getList('hikes')
      .subscribeForData()
      .switchMap((data: any) => {
        let observables: Observable<Hike>[] = data.map((item: any) => {
          let hike: Hike = new Hike(item, this.hikeProgramService);

          return hike
            .load()
            .catch((err: Error) => {
              console.warn(err);
              return Observable.of(null);
            });
        });

        return Observable.forkJoin(observables);
      })
      .map((hikes: Hike[]) => {
        return hikes.filter((hike: Hike) => (hike !== null));
      });
  }
}

export { Hike, IHike };
