import { ActionReducer } from '@ngrx/store';

import { IAuthenticationState } from './state';
import * as ApiActions from './actions';

export type Action = ApiActions.AllActions;

const initialState: IAuthenticationState = {
  auth: {
    token: null,
    refreshToken: null,
    user: null
  },
  loggingIn: true,
  failed: null,
  emailSent: false
};

export const reducer: ActionReducer<IAuthenticationState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case ApiActions.TWITTER_LOGIN:
    case ApiActions.REQUEST_VERIFY_TOKEN:
    case ApiActions.FACEBOOK_LOGIN:
    case ApiActions.GOOGLE_LOGIN:
    case ApiActions.MAGICLINK_REQUEST_TOKEN:
    case ApiActions.VERIFY:
    case ApiActions.MAGICLINK_LOGIN:
      return { ...state, loggingIn: true, failed: null };

    case ApiActions.MAGICLINK_EMAIL_SENT:
      return { ...state, emailSent: true, failed: null, loggingIn: false };

    case ApiActions.LOGIN_SUCCESS:
      return { ...{ auth: action.payload }, loggingIn: false, failed: null, emailSent: false };

      case ApiActions.USER_CANCELLED:
      case ApiActions.FAILURE_HAPPENED:
      return { ...state, ...{ failed: action.payload }, loggingIn: false, emailSent: false };

    case ApiActions.LOGOUT_START:
      return { ...state };

    case ApiActions.LOGOUT_SUCCESS:
      return { ...initialState, loggingIn: false };

    default:
      return state;
  }
};
