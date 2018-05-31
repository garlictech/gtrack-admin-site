import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { GeospatialSearchResponse } from 'subrepos/provider-client';

export interface IGeoSearchResponseItem {
  id: string;
  results: GeospatialSearchResponse;
}

export const geoSearchAdapter = createEntityAdapter<IGeoSearchResponseItem>();
export interface IGeoSearchEntityState extends EntityState<IGeoSearchResponseItem> {}

export interface IGeoSearchContextState {
  id: string;
  working: boolean;
}

export interface IAllGeoSearchContextState extends EntityState<IGeoSearchContextState> {}

export const geoSearchContextStateAdapter = createEntityAdapter<IGeoSearchContextState>();

export interface IGeoSearchState {
  geoSearches: IGeoSearchEntityState;
  contexts: IAllGeoSearchContextState;
}
