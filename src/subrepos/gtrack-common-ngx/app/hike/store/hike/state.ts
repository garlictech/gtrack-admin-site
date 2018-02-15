import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { HikeProgram } from '../../services/hike-program';

export const hikeAdapter = createEntityAdapter<HikeProgram>();
export interface IHikeEntityState extends EntityState<HikeProgram> {};

export interface IHikeContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export interface IAllHikeContextState extends EntityState<IHikeContextState> {};

export const hikeContextStateAdapter = createEntityAdapter<IHikeContextState>();

export interface IHikeState {
  hikes: IHikeEntityState,
  contexts: IAllHikeContextState
}
