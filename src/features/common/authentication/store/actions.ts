// tslint:disable:no-property-initializers max-classes-per-file
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Action } from '@ngrx/store';
import { Auth } from './state';

export enum AuthenticationActionTypes {
  TWITTER_LOGIN = '[Authentication] Login with Twitter',
  REQUEST_VERIFY_TOKEN = '[Authentication] Request Twitter verify token',
  VERIFY = '[Authentication] Verify user with token',
  FACEBOOK_LOGIN = '[Authentication] Login with Facebook',
  GOOGLE_LOGIN = '[Authentication] Login with Google',
  MAGICLINK_LOGIN = '[Authentication] Login with Magic Link',
  MAGICLINK_REQUEST_TOKEN = '[Authentication] Request a Magic Link',
  MAGICLINK_EMAIL_SENT = '[Authentication] Magic Link email sent',
  LOGIN_SUCCESS = '[Authentication] Login Success',
  FAILURE_HAPPENED = '[Authentication] Login/Logout Error',
  LOGOUT_START = '[Authentication] Logout Start',
  LOGOUT_SUCCESS = '[Authentication] Logout Success',
  UNAUTHORIZED = '[Authentication] Unauthorized',
  ROUTE_FORBIDDEN = '[Authentication] Route forbidden',
  USER_CANCELLED = '[Authentication] User cancelled',
  WINDOW_REOPENED = '[Authentication] Window reopened',
  TERMS_ACCEPTED = '[Authentication] Terms accepted',
  LOGIN_REFUSED = '[Authentication] Login refused as term is not accepted',
  SELECT_ROLE = '[Authentication] Auth role selected'
}

export class RequestVerifyToken implements Action {
  readonly type = AuthenticationActionTypes.REQUEST_VERIFY_TOKEN;

  constructor(public email: string) {}
}

export class Verify implements Action {
  readonly type = AuthenticationActionTypes.VERIFY;
  constructor(public token: string, public uid: string) {}
}

export class FacebookLogin implements Action {
  readonly type = AuthenticationActionTypes.FACEBOOK_LOGIN;
  constructor(public roles: Array<string>) {}
}

export class GoogleLogin implements Action {
  readonly type = AuthenticationActionTypes.GOOGLE_LOGIN;
  constructor(public roles: Array<string>) {}
}

export class TwitterLogin implements Action {
  readonly type = AuthenticationActionTypes.TWITTER_LOGIN;
  constructor(public roles: Array<string>) {}
}

export class RequestMagicLinkToken implements Action {
  readonly type = AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN;
  constructor(public email: string, public language: string, public roles: Array<string>) {}
}

export class MagicLinkLogin implements Action {
  readonly type = AuthenticationActionTypes.MAGICLINK_LOGIN;
  constructor(public token: string, public uid: string, public roles: Array<string>) {}
}

export class MagicLinkEmailSent implements Action {
  readonly type = AuthenticationActionTypes.MAGICLINK_EMAIL_SENT;
}

export class LoginSuccess implements Action {
  readonly type = AuthenticationActionTypes.LOGIN_SUCCESS;
  constructor(public auth: Auth | null) {}
}

export class FailureHappened implements Action {
  readonly type = AuthenticationActionTypes.FAILURE_HAPPENED;
  constructor(public error: any) {}
}

export class UserCancelled implements Action {
  readonly type = AuthenticationActionTypes.USER_CANCELLED;
  constructor(public error: any) {}
}

export class WindowReopened implements Action {
  readonly type = AuthenticationActionTypes.WINDOW_REOPENED;
  // Payload: the error object
  constructor(public error: any) {}
}

export class LogoutStart implements Action {
  readonly type = AuthenticationActionTypes.LOGOUT_START;
}

export class LogoutSuccess implements Action {
  readonly type = AuthenticationActionTypes.LOGOUT_SUCCESS;
}

export class Unauthorized implements Action {
  readonly type = AuthenticationActionTypes.UNAUTHORIZED;
}

export class RouteForbidden implements Action {
  readonly type = AuthenticationActionTypes.ROUTE_FORBIDDEN;

  constructor(public route?: ActivatedRouteSnapshot, public state?: RouterStateSnapshot) {}
}

export class TermsAccepted implements Action {
  readonly type = AuthenticationActionTypes.TERMS_ACCEPTED;
  constructor(public payload: boolean) {}
}

export class LoginRefused implements Action {
  readonly type = AuthenticationActionTypes.LOGIN_REFUSED;
}

export class SelectRole implements Action {
  readonly type = AuthenticationActionTypes.SELECT_ROLE;
  constructor(public payload: string) {}
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
  | RouteForbidden
  | UserCancelled
  | WindowReopened
  | TermsAccepted
  | LoginRefused
  | SelectRole;
