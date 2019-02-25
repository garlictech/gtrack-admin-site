// tslint:disable:only-arrow-functions
import { ActionReducer } from '@ngrx/store';

import * as Actions from './actions';
import { DeepstreamState, EDeepstreamState, initialState } from './state';

export type Action = Actions.AllActions;

export const reducer: ActionReducer<DeepstreamState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.DEEPSTREAM_LOGIN:
      return { ...state, state: EDeepstreamState.LOGGING_IN, failure: undefined };
    case Actions.DEEPSTREAM_AUTH_SUCCESS:
      return { ...state, state: EDeepstreamState.LOGGED_IN, failure: undefined, auth: { ...action.clientData } };
    case Actions.DEEPSTREAM_LOGOUT_SUCCESS:
      return { ...state, state: EDeepstreamState.LOGGED_OUT, failure: undefined, auth: undefined };
    case Actions.DEEPSTREAM_LOGIN_FAILED:
      return { ...state, state: EDeepstreamState.LOGGED_OUT, failure: { ...action.error } };
    case Actions.DEEPSTREAM_PERMISSION_RECORD_CHANGED:
      return { ...state, permissionRecord: { ...action.permissionRecord } };
    default:
      return state;
  }
};
