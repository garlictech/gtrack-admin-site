import { Action } from '@ngrx/store';

export const RESET = '[RouteInfoData] Reset';
export const ADD_TRACK = '[RouteInfoData] Add track';
export const PUSH_SEGMENT = '[RouteInfoData] Push segment';
export const POP_SEGMENT = '[RouteInfoData] Pop segment';
export const UPDATE_TOTAL = '[RouteInfoData] Update total';
export const SET_LOCATION = '[RouteInfoData] Set location';

export class Reset implements Action {
  readonly type = RESET;
  constructor() { /* EMPTY */ }
}

export class AddTrack implements Action {
  readonly type = ADD_TRACK;
  constructor(public payload: {
    track: any
  }) { /* EMPTY */ }
}

export class PushSegment implements Action {
  readonly type = PUSH_SEGMENT;
  constructor(public payload: {
    segment: any
  }) { /* EMPTY */ }
}

export class PopSegment implements Action {
  readonly type = POP_SEGMENT;
  constructor() { /* EMPTY */ }
}

export class UpdateTotal implements Action {
  readonly type = UPDATE_TOTAL;
  constructor(public payload: {
    total: any
  }) { /* EMPTY */ }
}

export class SetLocation implements Action {
  readonly type = SET_LOCATION;
  constructor(public payload: {
    location: any
  }) { /* EMPTY */ }
}

export type AllRouteInfoDataActions =
  | Reset
  | AddTrack
  | PushSegment
  | PopSegment
  | UpdateTotal
  | SetLocation;
