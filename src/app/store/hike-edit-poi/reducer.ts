import { ActionReducer, Action } from '@ngrx/store';
import { IHikeEditPoiState } from './state';
import { HikeEditPoiActions } from './actions';
import { AdminMapActions } from '../admin-map';

const initialState: IHikeEditPoiState = {
  wikipediaPois: [],
  googlePois: [],
  osmNaturalPois: [],
  osmAmenityPois: []
};

export function hikeEditPoiReducer(state = initialState, action: Action): IHikeEditPoiState {
  switch (action.type) {
    case HikeEditPoiActions.SET_WIKIPEDIA_POIS:
      return {
        ...state,
        wikipediaPois: action.payload.pois
      };
    case HikeEditPoiActions.SET_GOOGLE_POIS:
      return {
        ...state,
        wikipediaPois: action.payload.pois
      };
    default:
      return state;
  }
}
