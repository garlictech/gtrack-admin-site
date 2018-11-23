import { ActionReducer } from '@ngrx/store';
import { IHikeEditMapState } from '../state';
import { adminMapActions } from '../actions';

export const initialMapState: IHikeEditMapState = {
  mapId: ''
};

export function hikeEditMapReducer(
  state = initialMapState,
  action: adminMapActions.AllAdminMapActions
): IHikeEditMapState {
  switch (action.type) {
    case adminMapActions.RESET_MAP:
      return initialMapState;

    case adminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.mapId
      };

    default:
      return state;
  }
}
