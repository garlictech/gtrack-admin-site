import { Action } from '@ngrx/store';

export const RESET = '[HikeEditRoutePLanner] Reset';
export const ADD_ROUTE = '[HikeEditRoutePLanner] Add route';
export const PUSH_SEGMENT = '[HikeEditRoutePLanner] Push segment';
export const POP_SEGMENT = '[HikeEditRoutePLanner] Pop segment';
export const UPDATE_TOTAL = '[HikeEditRoutePLanner] Update total';
export const SET_LOCATION = '[HikeEditRoutePLanner] Set location';
export const SAVE_ROUTE = '[HikeEditRoutePLanner] Save route';

export class Reset implements Action {
  readonly type = RESET;
  constructor() { /* EMPTY */ }
}

export class AddRoute implements Action {
  readonly type = ADD_ROUTE;
  constructor(public payload: {
    route: any
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

export class SaveRoute implements Action {
  readonly type = SAVE_ROUTE;
  constructor() { /* EMPTY */ }
}

export type AllHikeEditRoutePlannerActions =
  | Reset
  | AddRoute
  | PushSegment
  | PopSegment
  | UpdateTotal
  | SetLocation
  | SaveRoute;
