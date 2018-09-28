import { filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HikeProgram } from './hike-program';

import {
  IHikeProgram,
  IHikeProgramStored,
  IHikeProgramSaveResponse,
  EObjectState
} from '../../../../../provider-client';
import { DeepstreamService } from '../../../../../deepstream-ngx';

@Injectable()
export class HikeProgramService {
  constructor(private _deepstream: DeepstreamService) {}

  get(id: string): Observable<IHikeProgramStored | null> {
    return this._deepstream
      .getRecord<IHikeProgramStored>(`hike_programs/${id}`)
      .get()
      .pipe(
        filter(data => data.stops instanceof Array),
        take(1)
      );
  }

  query(): Observable<IHikeProgramStored[]> {
    return this._deepstream
      .doQuery<IHikeProgramStored>({
        table: 'hike_programs',
        query: []
      })
      .pipe(take(1));
  }

  public save(hikeProgram: IHikeProgram) {
    let data = hikeProgram;

    if (hikeProgram instanceof HikeProgram) {
      data = hikeProgram.toObject();
    }

    return this._deepstream.callRpc<IHikeProgramSaveResponse>('admin.hike-program.save', data).pipe(take(1));
  }

  public updateState(id: string, state: EObjectState) {
    return this._deepstream
      .callRpc('admin.state', {
        id: id,
        table: 'hike_programs',
        state: state
      })
      .pipe(take(1));
  }

  public delete(id: string) {
    return this._deepstream
      .callRpc('admin.delete', {
        id: id,
        table: 'hike_programs'
      })
      .pipe(take(1));
  }
}
