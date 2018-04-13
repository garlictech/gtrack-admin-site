import { Action } from '@ngrx/store';

export const RESET_ROUTE_PLANNING_STATE = '[HikeEditRoutePlanner] Reset';
export const ROUTING_START = '[HikeEditRoutePlanner] Routing start';
export const ROUTING_FINISHED = '[HikeEditRoutePlanner] Routing finished';
export const ROUTING_ERROR = '[HikeEditRoutePlanner] Routing error';
export const ADD_ROUTE = '[HikeEditRoutePlanner] Add route';
export const PUSH_SEGMENT = '[HikeEditRoutePlanner] Push segment';
export const POP_SEGMENT = '[HikeEditRoutePlanner] Pop segment';
export const UPDATE_TOTAL = '[HikeEditRoutePlanner] Update total';
export const SET_LOCATION = '[HikeEditRoutePlanner] Set location';
export const SAVE_ROUTE = '[HikeEditRoutePlanner] Save route';

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
  constructor(public payload: {
    route: any
  }) {}
}

export class PushSegment implements Action {
  readonly type = PUSH_SEGMENT;
  constructor(public payload: {
    segment: any
  }) {}
}

export class PopSegment implements Action {
  readonly type = POP_SEGMENT;
  constructor() {}
}

export class UpdateTotal implements Action {
  readonly type = UPDATE_TOTAL;
  constructor(public payload: {
    total: any
  }) {}
}

export class SetLocation implements Action {
  readonly type = SET_LOCATION;
  constructor(public payload: {
    location: any
  }) {}
}

export type AllHikeEditRoutePlannerActions =
  | ResetRoutePlanningState
  | RoutingStart
  | RoutingFinished
  | RoutingError
  | AddRoute
  | PushSegment
  | PopSegment
  | UpdateTotal
  | SetLocation;
