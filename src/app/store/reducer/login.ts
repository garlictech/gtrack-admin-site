import { ILoginState } from '../state';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';

const initialState: ILoginState = {
  loginCalled: false
};

export function loginReducer(
  state = initialState,
  action: AuthActions.AllActions
): ILoginState {
  switch (action.type) {
    case AuthActions.GOOGLE_LOGIN:
      return {
        ...state,
        loginCalled: true
      };
    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.FAILURE_HAPPENED:
    case AuthActions.ROUTE_FORBIDDEN:
      return {
        ...state,
        loginCalled: false
      };
    default:
      return state;
  }
}
