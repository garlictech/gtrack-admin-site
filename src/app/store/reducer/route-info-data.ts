import { Action } from '@ngrx/store';
import { IRouteInfoDataState } from '../state';
import { routeInfoDataActions } from '../index';

const initialState: IRouteInfoDataState = {
  segments: [],
  total: {},
  location: '',
  track: {},
};

export function routeInfoDataReducer(
  state = initialState,
  action: routeInfoDataActions.AllRouteInfoDataActions
): IRouteInfoDataState {
  switch (action.type) {
    case routeInfoDataActions.RESET:
      return initialState;
    case routeInfoDataActions.ADD_TRACK:
      return {
        ...state,
        track: action.payload.track
      };
    case routeInfoDataActions.PUSH_SEGMENT:
      return {
        ...state,
        segments: [...state.segments, action.payload.segment]
      };
    case routeInfoDataActions.POP_SEGMENT:
      return {
        ...state,
        segments: state.segments.length > 1 ? state.segments.slice(0, state.segments.length - 1) : []
      };
    case routeInfoDataActions.UPDATE_TOTAL:
      return {
        ...state,
        total: action.payload.total
      };
    default:
      return state;
  }
}
