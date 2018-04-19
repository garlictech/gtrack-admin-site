import { IHikeEditMapState } from '../state';
import { adminMapActions } from '../index';

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
        mapId: action.payload.mapId
      };

    default:
      return state;

  }
}
