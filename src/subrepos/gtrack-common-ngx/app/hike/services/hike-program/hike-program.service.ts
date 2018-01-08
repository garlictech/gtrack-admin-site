import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HikeProgram } from './hike-program';
import { IHikeProgramData } from './interfaces';
import { DeepstreamService } from 'subrepos/deepstream-ngx';
import { CheckpointService } from '../checkpoint';

@Injectable()
export class HikeProgramService {

  constructor(
    private _deepstream: DeepstreamService,
    private _checkpointService: CheckpointService
  ) { }

  get(id: string): Observable<HikeProgram|null> {
    return this._deepstream
      .getRecord<IHikeProgramData>(`hikePrograms/${id}`)
      .get()
      .filter(data => (data.stops instanceof Array))
      .map(data => {
        let hike: HikeProgram = new HikeProgram(data, this._checkpointService);

        return hike;
      });
  }

  query(): Observable<HikeProgram[]> {
    return this._deepstream
      .getList<IHikeProgramData>('hikePrograms')
      .subscribeForData()
      .map(data => {
        return data
          .filter(item => (item.stops instanceof Array))
          .map(item => {
            let hike: HikeProgram = new HikeProgram(item, this._checkpointService);

            return hike;
          });
      });
  }
}
