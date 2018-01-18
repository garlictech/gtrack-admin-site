import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IHikeProgram } from '../../services/hike-program';

export const hikeAdapter = createEntityAdapter<IHikeProgram>();
export interface IHikeProgramEntityState extends EntityState<IHikeProgram> {};

export interface IHikeContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}
export const hikeContextStateAdapter = createEntityAdapter<IHikeContextState>();
export interface IHikeContextEntityState extends EntityState<IHikeContextState> {};

export interface IHikeState {
  hikes: IHikeProgramEntityState,
  contexts: IHikeContextEntityState
}
