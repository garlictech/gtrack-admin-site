import { Action } from '@ngrx/store';
import { Route } from '../../services/route';

export enum RouteActionTypes {
  LOAD_ROUTE = '[Route] Load route',
  LOAD_ROUTE_FAILED = '[Route] Load route failed',
  ROUTE_LOADED = '[Route] Route loaded'
}

export class LoadRoute implements Action {
  readonly type = RouteActionTypes.LOAD_ROUTE;

  constructor(public context: string) {
    // Empty
  }
}

export class LoadRouteFailed implements Action {
  readonly type = RouteActionTypes.LOAD_ROUTE_FAILED;

  constructor(public context: string) {
    // Empty
  }
}

export class RouteLoaded implements Action {
  readonly type = RouteActionTypes.ROUTE_LOADED;

  constructor(public context: string, public route: Route) {
    // Empty
  }
}

export type AllRouteActions =
  | LoadRoute
  | RouteLoaded
  | LoadRouteFailed;
