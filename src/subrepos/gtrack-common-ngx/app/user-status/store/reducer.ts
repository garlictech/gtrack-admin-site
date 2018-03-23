import { ActionReducer } from '@ngrx/store';

import { IUserStatusState } from './state';
import { AllUserStatusActions, UserStatusActionTypes } from './actions';

export const userStatusInitialState: IUserStatusState = {
  location: [0, 0]
};

export const userStatusReducer: ActionReducer<IUserStatusState> = (
  state: IUserStatusState = userStatusInitialState,
  action: AllUserStatusActions
): IUserStatusState => {
  switch (action.type) {
    case UserStatusActionTypes.LOCATION_REQUESTED:
      return {
        ...state,
        location: action.location
      };

    default:
      return state;
  }

}
