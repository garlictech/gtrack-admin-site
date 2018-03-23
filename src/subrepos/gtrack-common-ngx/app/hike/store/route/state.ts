import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Route } from '../../services/route';

export const routeAdapter = createEntityAdapter<Route>();
export interface IRouteEntityState extends EntityState<Route> {};

export interface IRouteContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
}

export interface IAllRouteContextState extends EntityState<IRouteContextState> {};

export const routeContextStateAdapter = createEntityAdapter<IRouteContextState>();

export interface IRouteState {
  routes: IRouteEntityState,
  contexts: IAllRouteContextState
}
