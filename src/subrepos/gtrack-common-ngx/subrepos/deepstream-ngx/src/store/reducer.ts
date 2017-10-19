import { ActionReducer, combineReducers } from '@ngrx/store';

import { IDeepstreamState } from './state';
import * as Actions from './actions';

export type Action = Actions.AllActions;

const deepstreamIninitialState: IDeepstreamState = {
  state: 'unknown',
  failure: null
};

export const reducer: ActionReducer<IDeepstreamState> = (state = deepstreamIninitialState, action: Action) => {
  switch (action.type) {
    case Actions.DEEPSTREAM_LOGIN:
      return { ...state, state: 'loggingIn', failure: null };
    case Actions.DEEPSTREAM_LOGIN_SUCCESS:
      return { ...state, state: 'loggedIn', failure: null };
    case Actions.DEEPSTREAM_LOGOUT_SUCCESS:
      return { ...state, state: 'loggedOut', failure: null };
    case Actions.DEEPSTREAM_LOGIN_FAILED:
      return { ...state, state: 'loginFailed', failure: action.payload };
    default:
      return state;
  }
};
