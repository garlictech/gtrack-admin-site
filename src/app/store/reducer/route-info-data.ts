import { Action } from '@ngrx/store';
import { IRouteInfoDataState } from '../state';
import { routeInfoDataActions } from '../index';

export const initialRouteInfoDataState: IRouteInfoDataState = {
  segments: [],
  total: {},
  location: '',
  route: {},
};

export function routeInfoDataReducer(
  state = initialRouteInfoDataState,
  action: routeInfoDataActions.AllRouteInfoDataActions
): IRouteInfoDataState {
  switch (action.type) {
    case routeInfoDataActions.RESET:
      return initialRouteInfoDataState;
    case routeInfoDataActions.ADD_ROUTE:
      return {
        ...state,
        route: action.payload.route
      };
    case routeInfoDataActions.PUSH_SEGMENT:
      return {
        ...state,
        segments: [
          ...state.segments,
          action.payload.segment
        ]
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
