import { ActionReducer } from '@ngrx/store';
import { IHikeEditMapState } from '../state';
import { adminMapActions } from '../index';

const initialState: IHikeEditMapState = {
  mapId: ''
};

export function hikeEditMapReducer(
  state = initialState,
  action: adminMapActions.AllAdminMapActions
): IHikeEditMapState {
  switch (action.type) {
    case adminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.payload.mapId
      };
    default:
      return state;
  }
}
