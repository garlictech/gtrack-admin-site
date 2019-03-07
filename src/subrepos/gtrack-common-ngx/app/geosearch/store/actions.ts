// tslint:disable:no-property-initializers max-classes-per-file
import {
  GeospatialBoxSearchPayload,
  GeospatialCircleSearchPayload,
  GeospatialSearchResponse
} from '@features/common/gtrack-interfaces';
import { Action } from '@ngrx/store';

export enum GeoSearchActionTypes {
  SEARCH_IN_BOX = '[GeoSearch] Search in box',
  SEARCH_IN_CIRCLE = '[GeoSearch] Search in circle',
  GEOSEARCH_COMPLETE = '[GeoSearch] Search complete'
}

export class SearchInBox implements Action {
  readonly type = GeoSearchActionTypes.SEARCH_IN_BOX;

  constructor(public query: GeospatialBoxSearchPayload, public context: string) {}
}

export class SearchInCircle implements Action {
  readonly type = GeoSearchActionTypes.SEARCH_IN_CIRCLE;

  constructor(public query: GeospatialCircleSearchPayload, public context: string) {}
}

export class GeoSearchComplete implements Action {
  readonly type = GeoSearchActionTypes.GEOSEARCH_COMPLETE;

  constructor(public results: GeospatialSearchResponse, public context: string) {}
}

export type AllGeoSearchActions = SearchInBox | SearchInCircle | GeoSearchComplete;
