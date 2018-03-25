import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IPoi } from 'subrepos/provider-client';

export const poiAdapter = createEntityAdapter<IPoi>();
export interface IPoiEntityState extends EntityState<IPoi> {};

export interface IPoiContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
}

export interface IAllPoiContextState extends EntityState<IPoiContextState> {};

export const poiContextStateAdapter = createEntityAdapter<IPoiContextState>();

export interface IPoiState {
  pois: IPoiEntityState,
  contexts: IAllPoiContextState
}
