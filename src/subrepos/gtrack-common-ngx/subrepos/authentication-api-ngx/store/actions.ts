import { Action } from '@ngrx/store';
import { IAuth } from './state';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const TWITTER_LOGIN = '[Authentication] Login with Twitter';
export const REQUEST_VERIFY_TOKEN = '[Authentication] Request Twitter verify token';
export const VERIFY = '[Authentication] Verify user with token';
export const FACEBOOK_LOGIN = '[Authentication] Login with Facebook';
export const GOOGLE_LOGIN = '[Authentication] Login with Google';
export const MAGICLINK_LOGIN = '[Authentication] Login with Magic Link';
export const MAGICLINK_REQUEST_TOKEN = '[Authentication] Request a Magic Link';
export const MAGICLINK_EMAIL_SENT = '[Authentication] Magic Link email sent';
export const LOGIN_SUCCESS = '[Authentication] Login Success';
export const FAILURE_HAPPENED = '[Authentication] Login/Logout Error';
export const LOGOUT_START = '[Authentication] Logout Start';
export const LOGOUT_SUCCESS = '[Authentication] Logout Success';
export const UNAUTHORIZED = '[Authentication] Unauthorized';
export const ROUTE_FORBIDDEN = '[Authentication] Route forbidden';

export class RequestVerifyToken implements Action {
  readonly type = REQUEST_VERIFY_TOKEN;
  // payload: the email
  constructor(public payload: string) {
    /* EMPTY */
  }
}

export class Verify implements Action {
  readonly type = VERIFY;
  constructor(public payload: { token: string; uid: string }) {
    /* EMPTY */
  }
}

export class FacebookLogin implements Action {
  readonly type = FACEBOOK_LOGIN;
  // Payload: the roles array
  constructor(public payload?: string[]) {
    /* EMPTY */
  }
}

export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
  // Payload: the roles array
  constructor(public payload?: string[]) {
    /* EMPTY */
  }
}

export class TwitterLogin implements Action {
  readonly type = TWITTER_LOGIN;
  constructor(public payload: string[]) {
    /* EMPTY */
  }
}
export class RequestMagicLinkToken implements Action {
  readonly type = MAGICLINK_REQUEST_TOKEN;
  constructor(
    public payload: {
      email: string;
      language: string;
      roles?: string[];
    }
  ) {
    /* EMPTY */
  }
}

export class MagicLinkLogin implements Action {
  readonly type = MAGICLINK_LOGIN;
  constructor(public payload: { token; uid; roles }) {
    /* EMPTY */
  }
}

export class MagicLinkEmailSent implements Action {
  readonly type = MAGICLINK_EMAIL_SENT;
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: IAuth) {
    /* EMPTY */
  }
}

export class FailureHappened implements Action {
  readonly type = FAILURE_HAPPENED;
  // Payload: the error object
  constructor(public payload: any) {
    /* EMPTY */
  }
}

export class LogoutStart implements Action {
  readonly type = LOGOUT_START;
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
}

export class Unauthorized implements Action {
  readonly type = UNAUTHORIZED;
}

export class RouteForbidden implements Action {
  readonly type = ROUTE_FORBIDDEN;

  constructor(
    public payload: {
      route?: ActivatedRouteSnapshot;
      state?: RouterStateSnapshot;
    }
  ) {
    // Empty
  }
}

export type AllActions =
  | RequestVerifyToken
  | Verify
  | FacebookLogin
  | GoogleLogin
  | TwitterLogin
  | RequestMagicLinkToken
  | MagicLinkLogin
  | MagicLinkEmailSent
  | LoginSuccess
  | FailureHappened
  | LogoutStart
  | LogoutSuccess
  | Unauthorized
  | RouteForbidden;
