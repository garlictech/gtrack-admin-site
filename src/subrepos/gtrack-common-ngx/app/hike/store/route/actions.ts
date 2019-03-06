// tslint:disable:no-property-initializers max-classes-per-file
import { EObjectState, RouteData, RouteStored } from '@features/common/gtrack-interfaces';
import { Action } from '@ngrx/store';

export enum RouteActionTypes {
  LOAD_ROUTE = '[Route] Load route',
  LOAD_ROUTE_FAILED = '[Route] Load route failed',
  ROUTE_LOADED = '[Route] Route loaded',
  SAVE_ROUTE = '[Route] Save route',
  ROUTE_SAVED = '[Route] Route saved',
  ROUTE_MODIFIED = '[Route] Route modified',
  UPDATE_ROUTE_STATE = '[Route] Update route state'
}

export class LoadRoute implements Action {
  readonly type = RouteActionTypes.LOAD_ROUTE;

  constructor(public context: string) {}
}

export class LoadRouteFailed implements Action {
  readonly type = RouteActionTypes.LOAD_ROUTE_FAILED;

  constructor(public context: string) {}
}

export class RouteLoaded implements Action {
  readonly type = RouteActionTypes.ROUTE_LOADED;

  constructor(public context: string, public route: RouteStored) {}
}

export class SaveRoute implements Action {
  readonly type = RouteActionTypes.SAVE_ROUTE;

  constructor(public route: RouteData) {}
}

export class RouteSaved implements Action {
  readonly type = RouteActionTypes.ROUTE_SAVED;

  constructor(public context: string) {}
}

export class RouteModified implements Action {
  readonly type = RouteActionTypes.ROUTE_MODIFIED;

  constructor(public context: string) {}
}

export class UpdateRouteState implements Action {
  readonly type = RouteActionTypes.UPDATE_ROUTE_STATE;

  constructor(public id: string, public state: EObjectState) {}
}

export type AllRouteActions =
  | LoadRoute
  | RouteLoaded
  | LoadRouteFailed
  | SaveRoute
  | RouteSaved
  | RouteModified
  | UpdateRouteState;
