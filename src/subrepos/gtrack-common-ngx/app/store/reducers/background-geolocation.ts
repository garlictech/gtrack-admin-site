import { ActionReducer } from '@ngrx/store';
import { IGeoPosition, CURRENT_LOCATION_OBTAINED, Actions } from '../../shared/services/background-geolocation-service';

export interface IBackgroundGeolocationState {
  currentLocation: IGeoPosition | null;
}

const initialState: IBackgroundGeolocationState = {
  currentLocation: null
};

export const reducer: ActionReducer<IBackgroundGeolocationState> = (
  state: IBackgroundGeolocationState = initialState,
  action: Actions
) => {
  switch (action.type) {
    case CURRENT_LOCATION_OBTAINED:
      return { ...state, currentLocation: action.location };

    default:
      return state;
  }
};
