import { ActionReducer } from '@ngrx/store';
import {
  IGeoPosition,
  BackgroundGeolocationActionTypes,
  Actions
} from '../../shared/services/background-geolocation-service';

import * as actions from '../../shared/services/background-geolocation-service/store/actions';

export interface IBackgroundGeolocationState {
  currentLocation: IGeoPosition | null;
  tracking: boolean;
}

const initialState: IBackgroundGeolocationState = {
  currentLocation: null,
  tracking: false
};

export const reducer: ActionReducer<IBackgroundGeolocationState> = (
  state: IBackgroundGeolocationState = initialState,
  action: Actions
) => {
  switch (action.type) {
    case BackgroundGeolocationActionTypes.CURRENT_LOCATION_OBTAINED:
      return { ...state, currentLocation: action.location };

    case BackgroundGeolocationActionTypes.START_TRACKING:
      return { ...state, tracking: true };

    case BackgroundGeolocationActionTypes.END_TRACKING:
      return { ...state, tracking: false };

    default:
      return state;
  }
};
