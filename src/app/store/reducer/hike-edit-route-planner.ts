import { Action } from '@ngrx/store';
import { IHikeEditRoutePlannerState } from '../state';
import { hikeEditRoutePlannerActions } from '../index';

export const initialRouteInfoDataState: IHikeEditRoutePlannerState = {
  segments: [],
  total: {},
  location: '',
  route: {},
};

export function hikeEditRoutePlannerReducer(
  state = initialRouteInfoDataState,
  action: hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions
): IHikeEditRoutePlannerState {
  switch (action.type) {
    case hikeEditRoutePlannerActions.RESET_ROUTE_PLANNING_STATE:
      return initialRouteInfoDataState;
    case hikeEditRoutePlannerActions.ADD_ROUTE:
      return {
        ...state,
        route: action.payload.route
      };
    case hikeEditRoutePlannerActions.PUSH_SEGMENT:
      return {
        ...state,
        segments: [
          ...state.segments,
          action.payload.segment
        ]
      };
    case hikeEditRoutePlannerActions.POP_SEGMENT:
      return {
        ...state,
        segments: state.segments.length > 1 ? state.segments.slice(0, state.segments.length - 1) : []
      };
    case hikeEditRoutePlannerActions.UPDATE_TOTAL:
      return {
        ...state,
        total: action.payload.total
      };
    default:
      return state;
  }
}