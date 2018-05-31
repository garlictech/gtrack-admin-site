import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IHikeProgramStored } from 'subrepos/provider-client';

export const hikeAdapter = createEntityAdapter<IHikeProgramStored>();
export interface IHikeEntityState extends EntityState<IHikeProgramStored> {}

export interface IHikeContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export interface IAllHikeContextState extends EntityState<IHikeContextState> {}

export const hikeContextStateAdapter = createEntityAdapter<IHikeContextState>();

export interface IHikeState {
  hikes: IHikeEntityState;
  contexts: IAllHikeContextState;
}
