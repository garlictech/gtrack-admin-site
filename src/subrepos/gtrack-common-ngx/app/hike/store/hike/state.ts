import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IHikeProgram } from '../../services/hike-program';

export const hikeAdapter = createEntityAdapter<IHikeProgram>();
export interface IHikeEntityState extends EntityState<IHikeProgram> {};

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
