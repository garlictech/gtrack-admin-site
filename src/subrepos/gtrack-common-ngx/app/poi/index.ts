import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

import { Poi } from './poi';

import 'rxjs/add/operator/take';

@Injectable()
export class PoiService {
  constructor(private db: AngularFireDatabase) { }

  get(id: string): Observable<Poi> {
    return this.db
      .object(`test/pois/${id}`)
      .take(1)
      .map((data: any) => {
        let poi: Poi = Object.assign(new Poi(data.$key), data);

        return poi;
      });
  }
}

export { Poi };
