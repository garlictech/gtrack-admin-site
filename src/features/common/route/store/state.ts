import { RouteStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export const routeAdapter = createEntityAdapter<RouteStored>();
export interface RouteEntityState extends EntityState<RouteStored> {}

export interface RouteContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
  saved: boolean;
}

export interface AllRouteContextState extends EntityState<RouteContextState> {}

export const routeContextStateAdapter = createEntityAdapter<RouteContextState>();

export interface RouteState {
  routes: RouteEntityState;
  contexts: AllRouteContextState;
}

export const featureName = 'features.common.route';
