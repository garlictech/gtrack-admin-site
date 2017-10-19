import { Action } from '@ngrx/store';

export const DEEPSTREAM_LOGIN_SUCCESS = '[Deepstream Authentication] Login Success';
export const DEEPSTREAM_LOGIN = '[Deepstream Authentication] Logging in...';
export const DEEPSTREAM_LOGIN_FAILED = '[Deepstream Authentication] Failed';
export const DEEPSTREAM_LOGOUT_SUCCESS = '[Deepstream Authentication] Logout success';

export class DeepstreamLoginSuccess implements Action {
  readonly type = DEEPSTREAM_LOGIN_SUCCESS;
}

export class DeepstreamLogoutSuccess implements Action {
  readonly type = DEEPSTREAM_LOGOUT_SUCCESS;
}

export class DeepstreamLogin implements Action {
  readonly type = DEEPSTREAM_LOGIN;

  // The token
  constructor(public payload: string) {
    /* EMPTY */
  }
}
export class DeepstreamLoginFailed implements Action {
  readonly type = DEEPSTREAM_LOGIN_FAILED;
  constructor(public payload: any) {
    /* EMPTY */
  }
}

export type AllActions = DeepstreamLogin | DeepstreamLoginFailed | DeepstreamLoginSuccess | DeepstreamLogoutSuccess;
