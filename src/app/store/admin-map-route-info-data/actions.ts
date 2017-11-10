import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class RouteInfoDataActions {
  static ADD_TRACK = '[RouteInfoData] Add track';
  static ADD_TRACK_TO_STORE = '[RouteInfoData] Add track to store';
  static PUSH_SEGMENT = '[RouteInfoData] Push segment';
  static PUSH_SEGMENTS_TO_STORE = '[RouteInfoData] Push segments to store';
  static POP_SEGMENT = '[RouteInfoData] Pop segment';
  static POP_SEGMENTS_TO_STORE = '[RouteInfoData] Pop segments to store';

  addTrack(geoJSON): Action {
    return {
      type: RouteInfoDataActions.ADD_TRACK,
      payload: geoJSON
    };
  }

  addTrackToStore(trackData): Action {
    return {
      type: RouteInfoDataActions.ADD_TRACK_TO_STORE,
      payload: trackData
    };
  }

  pushSegment(segment): Action {
    return {
      type: RouteInfoDataActions.PUSH_SEGMENT,
      payload: segment
    };
  }

  pushSegmentsToStore(data): Action {
    return {
      type: RouteInfoDataActions.PUSH_SEGMENTS_TO_STORE,
      payload: data
    };
  }

  popSegment(): Action {
    return {
      type: RouteInfoDataActions.POP_SEGMENT
    };
  }

  popSegmentsToStore(data): Action {
    return {
      type: RouteInfoDataActions.POP_SEGMENTS_TO_STORE,
      payload: data
    };
  }
}
