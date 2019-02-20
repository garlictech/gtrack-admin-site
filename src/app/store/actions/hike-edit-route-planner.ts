// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';

export const RESET_ROUTE_PLANNING_STATE = '[HikeEditRoutePlanner] Reset';
export const ROUTING_START = '[HikeEditRoutePlanner] Routing start';
export const ROUTING_FINISHED = '[HikeEditRoutePlanner] Routing finished';
export const ROUTING_ERROR = '[HikeEditRoutePlanner] Routing error';
export const ADD_ROUTE = '[HikeEditRoutePlanner] Add route';
export const PUSH_SEGMENT = '[HikeEditRoutePlanner] Push segment';
export const UPDATE_SEGMENT = '[HikeEditRoutePlanner] Update segment';
export const REMOVE_SEGMENTS = '[HikeEditRoutePlanner] Remove segments';
export const POP_SEGMENT = '[HikeEditRoutePlanner] Pop segment';
export const UPDATE_TOTAL = '[HikeEditRoutePlanner] Update total';
export const SET_LOCATION = '[HikeEditRoutePlanner] Set location';
export const SAVE_ROUTE = '[HikeEditRoutePlanner] Save route';
export const SET_PLANNING = '[HikeEditRoutePlanner] Set planning';

export class ResetRoutePlanningState implements Action {
  readonly type = RESET_ROUTE_PLANNING_STATE;
}

export class RoutingStart implements Action {
  readonly type = ROUTING_START;
}

export class RoutingFinished implements Action {
  readonly type = ROUTING_FINISHED;
}

export class RoutingError implements Action {
  readonly type = ROUTING_ERROR;
}

export class AddRoute implements Action {
  readonly type = ADD_ROUTE;
  constructor(public route: any) {}
}

export class PushSegment implements Action {
  readonly type = PUSH_SEGMENT;
  constructor(public segment: any) {}
}

export class UpdateSegment implements Action {
  readonly type = UPDATE_SEGMENT;
  constructor(public index: number, public segment: any) {}
}

export class RemoveSegments implements Action {
  readonly type = REMOVE_SEGMENTS;
  constructor(public idx: number, public count: number) {}
}

export class PopSegment implements Action {
  readonly type = POP_SEGMENT;
}

export class UpdateTotal implements Action {
  readonly type = UPDATE_TOTAL;
  constructor(public total: any) {}
}

export class SetLocation implements Action {
  readonly type = SET_LOCATION;
  constructor(public location: any) {}
}

export class SetPlanning implements Action {
  readonly type = SET_PLANNING;
  constructor(public planning: boolean) {}
}

export type AllHikeEditRoutePlannerActions =
  | ResetRoutePlanningState
  | RoutingStart
  | RoutingFinished
  | RoutingError
  | AddRoute
  | PushSegment
  | RemoveSegments
  | UpdateSegment
  | PopSegment
  | UpdateTotal
  | SetLocation
  | SetPlanning;
