import { ActionReducer, Action } from '@ngrx/store';
import { IHikeEditMapState } from './state';
import { HikeEditMapActions } from './actions';
import { AdminMapActions } from '../admin-map';

const initialState: IHikeEditMapState = {
  mapId: null,
  geoJsonOnMap: null
};

export function hikeEditMapReducer(state = initialState, action: Action): IHikeEditMapState {
  switch (action.type) {
    case AdminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.payload
      };
    case HikeEditMapActions.GEOJSON_ADDED:
      return {
        ...state,
        geoJsonOnMap: action.payload
      };
    case HikeEditMapActions.GEOJSON_REMOVED:
      return {
        ...state,
        geoJsonOnMap: null
      };
    default:
      return state;
  }
}
