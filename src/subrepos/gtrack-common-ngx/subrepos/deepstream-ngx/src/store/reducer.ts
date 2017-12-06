import { ActionReducer, combineReducers } from '@ngrx/store';

import { IDeepstreamState, initialState } from './state';
import * as Actions from './actions';

export type Action = Actions.AllActions;

export const reducer: ActionReducer<IDeepstreamState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.DEEPSTREAM_LOGIN:
      return { ...state, state: 'loggingIn', failure: null };
    case Actions.DEEPSTREAM_LOGIN_SUCCESS:
      return { ...state, state: 'loggedIn', failure: null, auth: { ...action.payload } };
    case Actions.DEEPSTREAM_LOGOUT_SUCCESS:
      return { ...state, state: 'loggedOut', failure: null };
    case Actions.DEEPSTREAM_LOGIN_FAILED:
      return { ...state, state: 'loginFailed', failure: { ...action.payload } };
    case Actions.DEEPSTREAM_PERMISSION_RECORD_CHANGED:
      return { ...state, permissionRecord: { ...action.payload } };
    default:
      return state;
  }
};
