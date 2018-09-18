import { IHikeEditMapState } from '../state';
import { adminMapActions } from '../actions';
import { ActionReducer } from '@ngrx/store';

export const initialMapState: IHikeEditMapState = {
  mapId: ''
};

export const hikeEditMapReducer: ActionReducer<IHikeEditMapState> = (
  state = initialMapState,
  action: adminMapActions.AllAdminMapActions
): IHikeEditMapState => {
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
};
