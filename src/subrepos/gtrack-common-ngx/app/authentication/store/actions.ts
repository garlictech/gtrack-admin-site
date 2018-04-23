import { Action } from '@ngrx/store';
import { Actions, IAuth } from 'subrepos/authentication-api-ngx';

export const TERMS_ACCEPTED = '[Authentication] Terms accepted';
export const LOGIN_REFUSED = '[Authentication] Login refused as term is not accepted';
export const SELECT_ROLE = '[Authentication] Auth role selected';

export class TermsAccepted implements Action {
  readonly type = TERMS_ACCEPTED;
  constructor(public payload: boolean) {
    /* EMPTY */
  }
}

export class LoginRefused implements Action {
  readonly type = LOGIN_REFUSED;
}

export class SelectRole implements Action {
  readonly type = SELECT_ROLE;
  constructor(public payload: string) {
    /* EMPTY */
  }
}

export * from 'subrepos/authentication-api-ngx/store/actions';

export type AllActions = TermsAccepted | LoginRefused | SelectRole | Actions.AllActions;
