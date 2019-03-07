import { HikeProgramStored } from '@features/common/gtrack-interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const hikeAdapter = createEntityAdapter<HikeProgramStored>();
export interface HikeEntityState extends EntityState<HikeProgramStored> {}

export interface HikeContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export interface AllHikeContextState extends EntityState<HikeContextState> {}

export const hikeContextStateAdapter = createEntityAdapter<HikeContextState>();

export interface HikeState {
  hikes: HikeEntityState;
  contexts: AllHikeContextState;
}
