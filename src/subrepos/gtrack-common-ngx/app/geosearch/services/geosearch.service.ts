import { Injectable } from '@angular/core';
import { DeepstreamService } from '../../deepstream';
import {
  IGeospatialBoxSearchPayload,
  IGeospatialCircleSearchPayload,
  GeospatialSearchResponse
} from 'subrepos/provider-client';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeoSearchService {
  constructor(private _deepstream: DeepstreamService) {}

  public searchBox(query: IGeospatialBoxSearchPayload) {
    return Observable.combineLatest([
      this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInBox', {
        payload: query
      }),
      Observable.timer(500).take(1)
    ]).map(results => results[0]);
  }

  public searchCircle(query: IGeospatialCircleSearchPayload) {
    return Observable.combineLatest([
      this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInCircle', {
        payload: query
      }),
      Observable.timer(500).take(1)
    ]).map(results => results[0]);
  }
}
