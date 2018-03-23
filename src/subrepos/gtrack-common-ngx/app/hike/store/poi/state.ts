import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Poi } from '../../services/poi';

export const poiAdapter = createEntityAdapter<Poi>();
export interface IPoiEntityState extends EntityState<Poi> {};

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
