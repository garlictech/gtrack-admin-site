import { Injectable } from '@angular/core';
import { DeepstreamService } from '../../deepstream';
import { IGeospatialBoxSearchPayload, IGeospatialCircleSearchPayload, GeospatialSearchResponse } from 'subrepos/provider-client';

@Injectable()
export class GeoSearchService {
  constructor(
    private _deepstream: DeepstreamService
  ) { }

  public searchBox(query: IGeospatialBoxSearchPayload) {
    return this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInBox', {
      payload: query
    });
  }

  public searchCircle(query: IGeospatialCircleSearchPayload) {
    return this._deepstream.callRpc<GeospatialSearchResponse>('open.geo.query.includedInCircle', {
      payload: query
    });
  }
}
