import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Poi, PoiService } from '../poi';
import { HikeProgram } from './hike-program';
import { HikeProgramRoundtrip } from './hike-program-roundtrip';
import { CheckpointService } from '../checkpoint';

import 'rxjs/add/observable/forkJoin';

@Injectable()
export class HikeProgramService {

  constructor(private poi: PoiService, private checkpointService: CheckpointService) {}

  get(dbObj: any): Observable<HikeProgram> {
    if (!dbObj) {
      return Observable.throw(new Error('Hike program data is empty'));
    }

    return Observable
      .forkJoin(...dbObj.pois.map((item: any) => {
        return this.poi
          .get(item.poiId)
          .map((poi: Poi) => {
            if (item.isCheckpoint === true) {
              poi.setToCheckpoint();
            }

            poi.inHike = true;
            poi.segment = item.segment;
            poi.distanceFromOrigo = item.distanceFromOrigo;

            return poi;
          });
      }))
      .map((pois: Poi[]) => {
        return this.create(pois, dbObj.isRoundTrip);
      });
 }

 private create(pois: Poi[], roundTrip = false): HikeProgram {
   let program: HikeProgram;

   if (roundTrip === true) {
     program = new HikeProgramRoundtrip(pois, this.checkpointService);
    } else {
     program = new HikeProgram(pois, this.checkpointService);
   }

   program.init();

   return program;
 }
}

export { HikeProgram };
