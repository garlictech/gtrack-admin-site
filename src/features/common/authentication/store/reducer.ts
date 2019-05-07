// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer, combineReducers } from '@ngrx/store';

import { AllActions as Action, AuthenticationActionTypes } from './actions';
import { JwtAuthState, UiState } from './state';

const initialJwtState: JwtAuthState = {
  auth: {
    token: undefined,
    refreshToken: undefined,
    user: undefined
  },
  loggingIn: true,
  failed: undefined,
  emailSent: false
};

const initialUiState: UiState = {
  termsAccepted: false,
  loginRefused: false,
  selectedRole: 'user'
};

export const jwtReducer: ActionReducer<JwtAuthState> = (state = initialJwtState, action: Action) => {
  console.log(action.type);
  switch (action.type) {
    case AuthenticationActionTypes.TWITTER_LOGIN:
    case AuthenticationActionTypes.REQUEST_VERIFY_TOKEN:
    case AuthenticationActionTypes.FACEBOOK_LOGIN:
    case AuthenticationActionTypes.GOOGLE_LOGIN:
    case AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN:
    case AuthenticationActionTypes.VERIFY:
    case AuthenticationActionTypes.MAGICLINK_LOGIN:
      return { ...state, loggingIn: true, failed: undefined };

    case AuthenticationActionTypes.MAGICLINK_EMAIL_SENT:
      return { ...state, emailSent: true, failed: undefined, loggingIn: false };

    case AuthenticationActionTypes.LOGIN_SUCCESS:
      return { ...{ auth: action.auth }, loggingIn: false, failed: undefined, emailSent: false };

    case AuthenticationActionTypes.USER_CANCELLED:
    case AuthenticationActionTypes.FAILURE_HAPPENED:
      return { ...state, ...{ failed: action.error }, loggingIn: false, emailSent: false };

    case AuthenticationActionTypes.LOGOUT_START:
      return { ...state };

    case AuthenticationActionTypes.LOGOUT_SUCCESS:
      return { ...initialJwtState, loggingIn: false };

    default:
      return state;
  }
};

export const uiErrorReducer: ActionReducer<UiState> = (state = initialUiState, action: Action) => {
  switch (action.type) {
    case AuthenticationActionTypes.TERMS_ACCEPTED:
      return { ...state, termsAccepted: action.payload, loginRefused: false };

    case AuthenticationActionTypes.LOGIN_REFUSED:
      return { ...state, loginRefused: true };

    case AuthenticationActionTypes.SELECT_ROLE:
      return { ...state, selectedRole: action.payload };

    default:
      return state;
  }
};

export const logout = (_reducer: any): any =>
  function(state: any, action: any): any {
    return _reducer(action.type === AuthenticationActionTypes.LOGOUT_SUCCESS ? undefined : state, action);
  };

const metaReducers = [logout];

const _reducers = {
  jwtAuth: jwtReducer,
  uiState: uiErrorReducer
};

export const reducer = combineReducers(_reducers);
export { metaReducers };
