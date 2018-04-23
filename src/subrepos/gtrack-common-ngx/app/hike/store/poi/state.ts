import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IPoi, IPoiStored } from 'subrepos/provider-client';

export const poiAdapter = createEntityAdapter<IPoiStored>();
export interface IPoiEntityState extends EntityState<IPoiStored> {};

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
