import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IMockHikeElement } from '../shared/interfaces';

@Injectable()
export class Actions {
  // Layout
  static OPEN_SIDENAV = '[Layout] Open Sidenav';
  static CLOSE_SIDENAV = '[Layout] Close Sidenav';
  // Hike Edit - todo: deprecated
  static SAVE_HIKE = '[Hike] Save hike';
  static DELETE_HIKE = '[Hike] Delete hike';
  // Routing
  static ROUTING_START = '[Routing] Start';
  static ROUTING_FINISHED = '[Routing] Finished';
  static ROUTING_ERROR = '[Routing] Error';

  /**
   * LAYOUT
   */

  openSidenav(): Action {
    return {
      type: Actions.OPEN_SIDENAV
    };
  }

  closeSidenav(): Action {
    return {
      type: Actions.CLOSE_SIDENAV
    };
  }

  /**
   * HIKE EDIT
   */

  saveHike(hike: IMockHikeElement): Action {
    return {
      type: Actions.SAVE_HIKE,
      payload: hike
    };
  }

  deleteHike(hikeId: string): Action {
    return {
      type: Actions.DELETE_HIKE,
      payload: hikeId
    };
  }

  /**
   * ROUTING
   */

  routingStart(): Action {
    return {
      type: Actions.ROUTING_START
    };
  }

  routingFinished(): Action {
    return {
      type: Actions.ROUTING_FINISHED
    };
  }

  routingError(): Action {
    return {
      type: Actions.ROUTING_ERROR
    };
  }
}
