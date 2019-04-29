import { PoiStored } from '@features/common/gtrack-interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const poiAdapter = createEntityAdapter<PoiStored>();
export interface PoiEntityState extends EntityState<PoiStored> {}

export interface PoiContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
}

export interface AllPoiContextState extends EntityState<PoiContextState> {}

export const poiContextStateAdapter = createEntityAdapter<PoiContextState>();

export interface PoiState {
  pois: PoiEntityState;
  contexts: AllPoiContextState;
}

export const featureName = 'features.common.poi';
