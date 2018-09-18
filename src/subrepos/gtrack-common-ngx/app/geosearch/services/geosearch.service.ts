import { timer as observableTimer, combineLatest as observableCombineLatest, Observable } from 'rxjs';

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
      observableTimer(500).pipe(
        take(1),
        map(() => '')
      )
    ).pipe(map(results => results[0]));
  }

  public searchCircle(query: IGeospatialCircleSearchPayload): Observable<string[]> {
    return observableCombineLatest(
      this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInCircle', {
        payload: query
      }),
      observableTimer(500).pipe(
        take(1),
        map(() => '')
      )
    ).pipe(map(results => results[0]));
  }
}
