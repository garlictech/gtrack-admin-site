import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';

import { Hike } from './hike';
import { IHike } from './ihike';
import { HikeProgramService } from '../hike-program';

@Injectable()
export class HikeService {

  constructor(private db: AngularFireDatabase, private hikeProgramService: HikeProgramService) { }

  get(id: string): Observable<Hike> {
    return this.db
      .object(`test/activities/hikes/${id}`)
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
    return this.db
      .list('test/activities/hikes')
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
