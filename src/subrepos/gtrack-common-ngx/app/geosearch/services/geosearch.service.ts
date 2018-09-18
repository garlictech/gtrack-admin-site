<<<<<<< HEAD
import { timer as observableTimer, combineLatest as observableCombineLatest, Observable } from 'rxjs';
=======
import { timer as observableTimer, combineLatest as observableCombineLatest,  Observable } from 'rxjs';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DeepstreamService } from '../../deepstream';
import {
  IGeospatialBoxSearchPayload,
  IGeospatialCircleSearchPayload,
  GeospatialSearchResponse
} from '../../../../provider-client';

@Injectable()
export class GeoSearchService {
  constructor(private _deepstream: DeepstreamService) {}

  public searchBox(query: IGeospatialBoxSearchPayload): Observable<string[]> {
    return observableCombineLatest(
      this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInBox', {
        payload: query
      }),
<<<<<<< HEAD
      observableTimer(500).pipe(
        take(1),
        map(() => '')
      )
    ).pipe(map(results => results[0]));
=======
      observableTimer(500)
        .pipe(
          take(1),
          map(() => '')
        )
    )
    .pipe(map(results => results[0]));
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  public searchCircle(query: IGeospatialCircleSearchPayload): Observable<string[]> {
    return observableCombineLatest(
      this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInCircle', {
        payload: query
      }),
<<<<<<< HEAD
      observableTimer(500).pipe(
        take(1),
        map(() => '')
      )
    ).pipe(map(results => results[0]));
=======
      observableTimer(500)
        .pipe(
          take(1),
          map(() => '')
        )
    )
    .pipe(map(results => results[0]));
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }
}
