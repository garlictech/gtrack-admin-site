import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export const ROUTING_START = '[Routing] Start';
export const ROUTING_FINISHED = '[Routing] Finished';
export const ROUTING_ERROR = '[Routing] Error';

export class RoutingStart implements Action {
  readonly type = ROUTING_START;
  constructor() {
    /* EMPTY */
  }
}

export class RoutingFinished implements Action {
  readonly type = ROUTING_FINISHED;
  constructor() {
    /* EMPTY */
  }
}

export class RoutingError implements Action {
  readonly type = ROUTING_ERROR;
  constructor() {
    /* EMPTY */
  }
}

export type AllRoutingAction =
  | RoutingStart
  | RoutingFinished
  | RoutingError;
