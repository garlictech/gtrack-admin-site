import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IRouteStored } from 'subrepos/provider-client';

export const routeAdapter = createEntityAdapter<IRouteStored>();
export interface IRouteEntityState extends EntityState<IRouteStored> {}

export interface IRouteContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
}

export interface IAllRouteContextState extends EntityState<IRouteContextState> {}

export const routeContextStateAdapter = createEntityAdapter<IRouteContextState>();

export interface IRouteState {
  routes: IRouteEntityState;
  contexts: IAllRouteContextState;
}
