import { ActionReducer, Action } from '@ngrx/store';
import { IRouteInfoDataState } from './state';
import { RouteInfoDataActions } from './actions';

const initialState: IRouteInfoDataState = {
  segments: [],
  total: {},
  location: '',
  track: {},
};

export function routeInfoDataReducer(state = initialState, action: Action): IRouteInfoDataState {
  switch (action.type) {
    case RouteInfoDataActions.ADD_TRACK_TO_STORE:
      return {
        ...state,
        track: action.payload
      };
    case RouteInfoDataActions.PUSH_SEGMENTS_TO_STORE:
      return {
        ...state,
        segments: action.payload.segments,
        total: action.payload.total
      };
    case RouteInfoDataActions.POP_SEGMENTS_TO_STORE:
      return {
        ...state,
        segments: action.payload.segments,
        total: action.payload.total
      };
    default:
      return state;
  }
}
