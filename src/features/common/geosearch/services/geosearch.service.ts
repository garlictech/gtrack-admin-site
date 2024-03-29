import { combineLatest as observableCombineLatest, Observable, timer as observableTimer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import {
  GeospatialBoxSearchPayload,
  GeospatialCircleSearchPayload,
  GeospatialSearchResponse
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Injectable()
export class GeoSearchService {
  constructor(private readonly _deepstream: DeepstreamService) {}

  searchBox(query: GeospatialBoxSearchPayload): Observable<Array<string>> {
    return this._search(query, 'open.geo.query.includedInBox');
  }

  searchCircle(query: GeospatialCircleSearchPayload): Observable<Array<string>> {
    return this._search(query, 'open.geo.query.includedInCircle');
  }

  private _search(query: any, name: string): Observable<Array<string>> {
    return observableCombineLatest(
      this._deepstream.callRpc<GeospatialSearchResponse>(name, {
        payload: query
      }),
      observableTimer(500).pipe(
        take(1),
        map(() => '')
      )
    ).pipe(map(results => results[0]));
  }
}
