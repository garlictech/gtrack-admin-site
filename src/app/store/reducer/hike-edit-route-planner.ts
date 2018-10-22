import { ActionReducer } from '@ngrx/store';
import { IHikeEditRoutePlannerState } from '../state';
import { hikeEditRoutePlannerActions } from '../actions';

import _cloneDeep from 'lodash-es/cloneDeep';

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
  routing: false,
  planning: true
};

// export function hikeEditRoutePlannerReducer(
export const hikeEditRoutePlannerReducer: ActionReducer<IHikeEditRoutePlannerState> = (
  state = initialRouteInfoDataState,
  action: hikeEditRoutePlannerActions.AllHikeEditRoutePlannerActions
): IHikeEditRoutePlannerState => {
  const newState = _cloneDeep(state);

  switch (action.type) {

    case hikeEditRoutePlannerActions.RESET_ROUTE_PLANNING_STATE:
      return initialRouteInfoDataState;

    case hikeEditRoutePlannerActions.ROUTING_START:
      return {
        ...state,
        routing: true
      };

    case hikeEditRoutePlannerActions.ROUTING_FINISHED:
      return {
        ...state,
        routing: false
      };

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

    case hikeEditRoutePlannerActions.UPDATE_SEGMENT:
      newState.segments.splice(action.index, 1, action.segment);
      return newState;

    case hikeEditRoutePlannerActions.REMOVE_SEGMENTS:
      newState.segments.splice(action.idx, action.count);
      return newState;

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
};
