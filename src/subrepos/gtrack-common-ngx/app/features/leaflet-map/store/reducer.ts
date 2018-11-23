import { ActionReducer } from '@ngrx/store';
import { IState } from './state';
import { ActionTypes } from './actions';
import * as Actions from './actions';

export const initialState: IState = {
  mapId: ''
};

export function reducer(state = initialState, action: Actions.AllActions): IState {
  switch (action.type) {
    case ActionTypes.ResetMap:
      return initialState;

    case ActionTypes.RegisterMap:
      return {
        ...state,
        mapId: action.mapId
      };

    default:
      return state;
  }
}
