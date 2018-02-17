import { Action } from '@ngrx/store';
import { Route } from '../../services/route';
import { IRoute, IRouteSaveResponse } from 'subrepos/provider-client';

export enum RouteActionTypes {
  LOAD_ROUTE = '[Route] Load route',
  LOAD_ROUTE_FAILED = '[Route] Load route failed',
  ROUTE_LOADED = '[Route] Route loaded',
  CREATE_ROUTE = '[Route] Create route',
  ROUTE_CREATED = '[Route] Route created'
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

export class CreateRoute implements Action {
  readonly type = RouteActionTypes.CREATE_ROUTE;

  constructor (public route: IRoute) {}
}

export class RouteCreated implements Action {
  readonly type = RouteActionTypes.ROUTE_CREATED;

  constructor (public context: string) {}
}

export type AllRouteActions =
  | LoadRoute
  | RouteLoaded
  | LoadRouteFailed
  | CreateRoute
  | RouteCreated;
