import { ActionReducer, Action } from '@ngrx/store';
import { IRouteInfoDataState } from '../state';
import { RouteInfoDataActions } from '../actions';

const initialState: IRouteInfoDataState = {
  segments: [],
  total: {},
  location: '',
  track: {},
};

export function routeInfoDataReducer(state = initialState, action: Action): IRouteInfoDataState {
  switch (action.type) {
    case RouteInfoDataActions.RESET:
      return initialState;
    case RouteInfoDataActions.ADD_TRACK:
      return {
        ...state,
        track: action.payload.track
      };
    case RouteInfoDataActions.PUSH_SEGMENT:
      return {
        ...state,
        segments: [...state.segments, action.payload.segment]
      };
    case RouteInfoDataActions.POP_SEGMENT:
      return {
        ...state,
        segments: state.segments.length > 1 ?
          state.segments.slice(0, state.segments.length - 1) :
          []
      };
    case RouteInfoDataActions.UPDATE_TOTAL:
      return {
        ...state,
        total: action.payload.total
      };
    default:
      return state;
  }
}
