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
    // return this._deepstream
    //   .doQuery<IHikeProgramStored>({
    //     table: 'hike_programs',
    //     query: []
    //   })
    //   .map(data => {
    //     return data
    //       .filter(item => (item.stops instanceof Array))
    //       .map(item => {
    //         let hike: HikeProgram = new HikeProgram(item, this._checkpointService);

    //         return hike;
    //       });
    //   });

    return Observable.of([
      new HikeProgram(
        {
          id: '1',
          distance: 1234,
          uphill: 123,
          downhill: 132,
          time: 123,
          score: 10,
          location: 'Alsóberecki, HU',
          difficulty: 'hard',
          routeIcon: '',
          elevationIcon: '',
          routeId: '12',
          description: {
            hu_HU: {
              title: 'Good hike',
              summary: ''
            }
          },
          isRoundTrip: false,
          pois: [],
          stops: [],
          rate: 'rate'
        },
        this._checkpointService
      ),

      new HikeProgram(
        {
          id: '2',
          distance: 3432,
          uphill: 55,
          downhill: 765,
          time: 765756,
          score: 160,
          location: 'Felsőberecki, HU',
          difficulty: 'hard',
          routeIcon: '',
          elevationIcon: '',
          routeId: '12',
          description: {
            hu_HU: {
              title: 'Best hike',
              summary: ''
            }
          },
          isRoundTrip: false,
          pois: [],
          stops: [],
          rate: 'rate'
        },
        this._checkpointService
      )
    ]);
  }

  public create(hikeProgram: IHikeProgram) {
    let data = hikeProgram;

    if (hikeProgram instanceof HikeProgram) {
      data = hikeProgram.toObject();
    }

    return this._deepstream.callRpc<IHikeProgramSaveResponse>('admin.hike-program.save', data);
  }
}
