// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer } from '@ngrx/store';

import * as ApiActions from './actions';
import { AuthenticationState } from './state';

export type Action = ApiActions.AllActions;

const initialState: AuthenticationState = {
  auth: {
    token: undefined,
    refreshToken: undefined,
    user: undefined
  },
  loggingIn: true,
  failed: undefined,
  emailSent: false
};

export const reducer: ActionReducer<AuthenticationState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case ApiActions.TWITTER_LOGIN:
    case ApiActions.REQUEST_VERIFY_TOKEN:
    case ApiActions.FACEBOOK_LOGIN:
    case ApiActions.GOOGLE_LOGIN:
    case ApiActions.MAGICLINK_REQUEST_TOKEN:
    case ApiActions.VERIFY:
    case ApiActions.MAGICLINK_LOGIN:
      return { ...state, loggingIn: true, failed: undefined };

    case ApiActions.MAGICLINK_EMAIL_SENT:
      return { ...state, emailSent: true, failed: undefined, loggingIn: false };

    case ApiActions.LOGIN_SUCCESS:
      return { ...{ auth: action.auth }, loggingIn: false, failed: undefined, emailSent: false };

    case ApiActions.USER_CANCELLED:
    case ApiActions.FAILURE_HAPPENED:
      return { ...state, ...{ failed: action.error }, loggingIn: false, emailSent: false };

    case ApiActions.LOGOUT_START:
      return { ...state };

    case ApiActions.LOGOUT_SUCCESS:
      return { ...initialState, loggingIn: false };

    default:
      return state;
  }
};
