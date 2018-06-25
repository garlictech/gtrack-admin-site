import { ActionReducer, combineReducers } from '@ngrx/store';

import { IAuthenticationState, IJwtAuthState } from './state';
import * as Actions from './actions';
import { Reducer as jwtReducer } from 'subrepos/authentication-api-ngx';

export type Action = Actions.AllActions;

const initialState = {
  termsAccepted: false,
  loginRefused: false,
  selectedRole: 'user'
};

export const uiErrorReducer: ActionReducer<any> = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.TERMS_ACCEPTED:
      return { ...state, termsAccepted: action.payload, loginRefused: false };

    case Actions.LOGIN_REFUSED:
      return { ...state, loginRefused: true };

    case Actions.SELECT_ROLE:
      return { ...state, selectedRole: action.payload };

    default:
      return state;
  }
};

const _reducer = {
  jwtAuth: jwtReducer,
  uiState: uiErrorReducer
};

export const reducer = combineReducers(_reducer);
