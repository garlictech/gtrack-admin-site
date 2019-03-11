import { GeospatialSearchResponse } from '@features/common/gtrack-interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface GeoSearchResponseItem {
  id: string;
  results: GeospatialSearchResponse;
}

export const geoSearchAdapter = createEntityAdapter<GeoSearchResponseItem>();
export interface GeoSearchEntityState extends EntityState<GeoSearchResponseItem> {}

export interface GeoSearchContextState {
  id: string;
  working: boolean;
}

export interface AllGeoSearchContextState extends EntityState<GeoSearchContextState> {}

export const geoSearchContextStateAdapter = createEntityAdapter<GeoSearchContextState>();

export interface GeoSearchState {
  geoSearches: GeoSearchEntityState;
  contexts: AllGeoSearchContextState;
}
