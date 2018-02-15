import { ActionReducer, combineReducers } from '@ngrx/store';

import { IDeepstreamState, initialState, EDeepstreamState } from './state';
import * as Actions from './actions';

export type Action = Actions.AllActions;

export const reducer: ActionReducer<IDeepstreamState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.DEEPSTREAM_LOGIN:
      return { ...state, state: EDeepstreamState.LOGGING_IN, failure: null };
    case Actions.DEEPSTREAM_AUTH_SUCCESS:
      return { ...state, state: EDeepstreamState.LOGGED_IN, failure: null, auth: { ...action.payload } };
    case Actions.DEEPSTREAM_LOGOUT_SUCCESS:
      return { ...state, state: EDeepstreamState.LOGGED_OUT, failure: null, auth: null };
    case Actions.DEEPSTREAM_LOGIN_FAILED:
      return { ...state, state: EDeepstreamState.LOGGED_OUT, failure: { ...action.payload } };
    case Actions.DEEPSTREAM_PERMISSION_RECORD_CHANGED:
      return { ...state, permissionRecord: { ...action.payload } };
    default:
      return state;
  }
};
