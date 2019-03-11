import { Injectable } from '@angular/core';
import _cloneDeep from 'lodash-es/cloneDeep';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { HikeProgram } from './hike-program';

import { DeepstreamService } from '@features/common/deepstream-ngx';
import {
  EObjectState,
  HikeProgramData,
  HikeProgramSaveResponse,
  HikeProgramStored
} from '@features/common/gtrack-interfaces';

@Injectable()
export class HikeProgramService {
  constructor(private readonly _deepstream: DeepstreamService) {}

  get(id: string): Observable<HikeProgramStored | null> {
    return this._deepstream
      .getRecord<HikeProgramStored>(`hike_programs/${id}`)
      .get()
      .pipe(
        filter(data => data.stops instanceof Array),
        take(1)
      );
  }

  query(): Observable<Array<HikeProgramStored>> {
    return this._deepstream
      .doQuery<HikeProgramStored>({
        table: 'hike_programs',
        query: []
      })
      .pipe(take(1));
  }

  save(hikeProgram: HikeProgramData): Observable<HikeProgramSaveResponse> {
    let data = hikeProgram;

    if (hikeProgram instanceof HikeProgram) {
      data = hikeProgram.toObject();
    }

    return this._deepstream.callRpc<HikeProgramSaveResponse>('admin.hike-program.save', data).pipe(take(1));
  }

  updateState(id: string, state: EObjectState): Observable<any> {
    return this._deepstream
      .callRpc('admin.state', {
        id,
        table: 'hike_programs',
        state
      })
      .pipe(take(1));
  }

  delete(id: string): Observable<any> {
    return this._deepstream
      .callRpc('admin.delete', {
        id,
        table: 'hike_programs'
      })
      .pipe(take(1));
  }

  reverse(hikeProgram: HikeProgramStored): HikeProgramStored {
    const reversed = _cloneDeep(hikeProgram);
    const isReversed = !!hikeProgram.reversed;
    const reverseStops = reversed.reverseStops;
    const reverseScore = reversed.reverseScore;
    const score = reversed.score;
    const time = reversed.time;
    const stops = reversed.stops;
    const reverseTime = reversed.reverseTime;
    const uphill = reversed.uphill;
    const downhill = reversed.downhill;

    reversed.reversed = !isReversed;
    reversed.stops = reverseStops;
    reversed.score = reverseScore;
    reversed.time = reverseTime;
    reversed.uphill = downhill;
    reversed.downhill = uphill;
    reversed.reverseScore = score;
    reversed.reverseTime = time;
    reversed.reverseStops = stops;

    return reversed;
  }
}
