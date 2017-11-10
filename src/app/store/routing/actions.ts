import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class RoutingActions {
  static ROUTING_START = '[Routing] Start';
  static ROUTING_FINISHED = '[Routing] Finished';
  static ROUTING_ERROR = '[Routing] Error';

  routingStart(): Action {
    return {
      type: RoutingActions.ROUTING_START
    };
  }

  routingFinished(): Action {
    return {
      type: RoutingActions.ROUTING_FINISHED
    };
  }

  routingError(): Action {
    return {
      type: RoutingActions.ROUTING_ERROR
    };
  }
}
