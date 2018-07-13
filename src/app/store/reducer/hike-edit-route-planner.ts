import { Action, ActionReducer } from '@ngrx/store';
import { IHikeEditRoutePlannerState } from '../state';
import { hikeEditRoutePlannerActions } from '..';

export const initialRouteDataState: GeoJSON.FeatureCollection<any> = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: []
    },
    properties: {
      name: 'Tour track'
    }
  }]
};

export const initialRouteInfoDataState: IHikeEditRoutePlannerState = {
  segments: [],
  total: {},
  location: '',
  route: initialRouteDataState,
  planning: true
};

// export function hikeEditRoutePlannerReducer(
export const hikeEditRoutePlannerReducer: ActionReducer<IHikeEditRoutePlannerState> = (
  state = initialRouteInfoDataState,
  action: hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions
): IHikeEditRoutePlannerState => {
  switch (action.type) {

    case hikeEditRoutePlannerActions.RESET_ROUTE_PLANNING_STATE:
      return initialRouteInfoDataState;

    case hikeEditRoutePlannerActions.ADD_ROUTE:
      return {
        ...state,
        route: action.route
      };

    case hikeEditRoutePlannerActions.PUSH_SEGMENT:
      return {
        ...state,
        segments: [
          ...state.segments,
          action.segment
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
        total: action.total
      };

    case hikeEditRoutePlannerActions.SET_PLANNING:
      return {
        ...state,
        planning: action.planning
      };

    default:
      return state;

  }
}
