import { Action } from '@ngrx/store';
import { IMockHikeElement } from '../shared/interfaces';

/**
 * LAYOUT
 */

export const OPEN_SIDENAV = '[Layout] Open Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';

export class OpenSidenavAction implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenavAction implements Action {
  readonly type = CLOSE_SIDENAV;
}

/**
 * HIKE EDIT
 */

export const SAVE_HIKE = '[Hike] Save hike';
export const DELETE_HIKE = '[Hike] Delete hike';

export class SaveHikeAction implements Action {
  readonly type = SAVE_HIKE;
  constructor(public payload: IMockHikeElement) {}
}

export class DeleteHikeAction implements Action {
  readonly type = DELETE_HIKE;
  constructor(public payload: string) {}
}

/**
 * ROUTING
 */

export const ROUTING_START = '[Routing] Start';
export const ROUTING_FINISHED = '[Routing] Finished';
export const ROUTING_ERROR = '[Routing] Error';

export class RoutingStartAction implements Action {
  readonly type = ROUTING_START;
}

export class RoutingFinishedAction implements Action {
  readonly type = ROUTING_FINISHED;
}

export class RoutingErrorAction implements Action {
  readonly type = ROUTING_ERROR;
}

export type Actions =
  | OpenSidenavAction
  | CloseSidenavAction
  | SaveHikeAction
  | DeleteHikeAction
  | RoutingStartAction
  | RoutingFinishedAction
  | RoutingErrorAction;
