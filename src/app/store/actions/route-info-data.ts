import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class RouteInfoDataActions {
  static RESET = '[RouteInfoData] Reset';
  static ADD_TRACK = '[RouteInfoData] Add track';
  static PUSH_SEGMENT = '[RouteInfoData] Push segment';
  static POP_SEGMENT = '[RouteInfoData] Pop segment';
  static UPDATE_TOTAL = '[RouteInfoData] Update total';
  static SET_LOCATION = '[RouteInfoData] Set location';

  reset(): Action {
    return {
      type: RouteInfoDataActions.RESET
    };
  }

  addTrack(track): Action {
    return {
      type: RouteInfoDataActions.ADD_TRACK,
      payload: {
        track: track
      }
    };
  }

  pushSegment(segment): Action {
    return {
      type: RouteInfoDataActions.PUSH_SEGMENT,
      payload: {
        segment: segment
      }
    };
  }

  popSegment(): Action {
    return {
      type: RouteInfoDataActions.POP_SEGMENT
    };
  }

  updateTotal(total): Action {
    return {
      type: RouteInfoDataActions.UPDATE_TOTAL,
      payload: {
        total: total
      }
    };
  }

  setLocation(total): Action {
    return {
      type: RouteInfoDataActions.SET_LOCATION,
      payload: {
        location: location
      }
    };
  }
}
