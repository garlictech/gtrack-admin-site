import { ActionReducer, Action } from '@ngrx/store';
import { IHikeEditMapState } from '../state';
import { AdminMapActions } from '../actions';

const initialState: IHikeEditMapState = {
  mapId: null
};

export function hikeEditMapReducer(state = initialState, action: Action): IHikeEditMapState {
  switch (action.type) {
    case AdminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.payload
      };
    default:
      return state;
  }
}
