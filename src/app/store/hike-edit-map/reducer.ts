import { ActionReducer, Action } from '@ngrx/store';
import { IHikeEditMapState } from './state';
import { HikeEditMapActions } from './actions';
import { AdminMapActions } from '../admin-map';

const initialState: IHikeEditMapState = {
  mapId: null,
  mode: 'routing',
  bufferShown: false,
  geoJsonOnMap: null
};

export function hikeEditMapReducer(state = initialState, action: Action): IHikeEditMapState {
  switch (action.type) {
    case AdminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.payload
      };
    case HikeEditMapActions.SET_MODE:
      return {
        ...state,
        mode: action.payload
      };
    case HikeEditMapActions.TOGGLE_BUFFER:
      return {
        ...state,
        bufferShown: !state.bufferShown
      };
    case HikeEditMapActions.GEOJSON_ADDED:
      return {
        ...state,
        geoJsonOnMap: action.payload
      };
    default:
      return state;
  }
}
