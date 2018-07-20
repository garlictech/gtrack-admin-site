import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { HikeProgram } from './hike-program';

import { IHikeProgram, IHikeProgramStored, IHikeProgramSaveResponse, EObjectState } from '../../../../../provider-client';
import { DeepstreamService } from '../../../../../deepstream-ngx';
import { CheckpointService } from '../checkpoint';

@Injectable()
export class HikeProgramService {
  constructor(private _deepstream: DeepstreamService, private _checkpointService: CheckpointService) {}

  get(id: string): Observable<IHikeProgramStored | null> {
    return this._deepstream
      .getRecord<IHikeProgramStored>(`hike_programs/${id}`)
      .get()
      .filter(data => data.stops instanceof Array)
      .take(1);
  }

  query(): Observable<IHikeProgramStored[]> {
    return this._deepstream
      .doQuery<IHikeProgramStored>({
        table: 'hike_programs',
        query: []
      })
      .take(1);
  }

  public save(hikeProgram: IHikeProgram) {
    let data = hikeProgram;

    if (hikeProgram instanceof HikeProgram) {
      data = hikeProgram.toObject();
    }

    return this._deepstream.callRpc<IHikeProgramSaveResponse>('admin.hike-program.save', data).take(1);
  }

  public updateState(id: string, state: EObjectState) {
    return this._deepstream
      .callRpc('admin.state', {
        id: id,
        table: 'hike_programs',
        state: state
      })
      .take(1);
  }

  public delete(id: string) {
    return this._deepstream
      .callRpc('admin.delete', {
        id: id,
        table: 'hike_programs'
      })
      .take(1);
  }
}
