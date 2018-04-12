import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { HikeProgram } from './hike-program';
import { IHikeProgram, IHikeProgramStored, IHikeProgramSaveResponse } from 'subrepos/provider-client';
import { DeepstreamService } from 'subrepos/deepstream-ngx';
import { CheckpointService } from '../checkpoint';

@Injectable()
export class HikeProgramService {
  constructor(private _deepstream: DeepstreamService, private _checkpointService: CheckpointService) {}

  get(id: string): Observable<HikeProgram | null> {
    return this._deepstream
      .getRecord<IHikeProgramStored>(`hike_programs/${id}`)
      .get()
      .filter(data => data.stops instanceof Array)
      .map(data => {
        let hike: HikeProgram = new HikeProgram(data, this._checkpointService);

        return hike;
      });
  }

  query(): Observable<HikeProgram[]> {
    return this._deepstream
      .doQuery<IHikeProgramStored>({
        table: 'hike_programs',
        query: []
      })
      .map(data => {
        return data.filter(item => item.stops instanceof Array).map(item => {
          let hike: HikeProgram = new HikeProgram(item, this._checkpointService);

          return hike;
        });
      });
  }

  public create(hikeProgram: IHikeProgram) {
    let data = hikeProgram;

    if (hikeProgram instanceof HikeProgram) {
      data = hikeProgram.toObject();
    }

    return this._deepstream.callRpc<IHikeProgramSaveResponse>('admin.hike-program.save', data);
  }
}
