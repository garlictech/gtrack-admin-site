// tslint:disable:no-property-initializers max-classes-per-file
import { IClientData } from '@garlictech/deepstream-rxjs';
import { Action } from '@ngrx/store';

export const DEEPSTREAM_AUTH_SUCCESS = '[Deepstream Authentication] Authentication Success';
export const DEEPSTREAM_LOGIN_SUCCESS = '[Deepstream Authentication] Login Success';
export const DEEPSTREAM_LOGIN = '[Deepstream Authentication] Logging in...';
export const DEEPSTREAM_LOGIN_FAILED = '[Deepstream Authentication] Failed';
export const DEEPSTREAM_LOGOUT_SUCCESS = '[Deepstream Authentication] Logout success';
export const DEEPSTREAM_PERMISSION_RECORD_CHANGED = '[Deepstream] Permission record changed';

export class DeepstreamLoginSuccess implements Action {
  readonly type = DEEPSTREAM_LOGIN_SUCCESS;
  constructor(public clientData: IClientData) {}
}

export class DeepstreamAuthSuccess implements Action {
  readonly type = DEEPSTREAM_AUTH_SUCCESS;
  constructor(public clientData: IClientData) {}
}

export class DeepstreamLogoutSuccess implements Action {
  readonly type = DEEPSTREAM_LOGOUT_SUCCESS;
}

export class DeepstreamLogin implements Action {
  readonly type = DEEPSTREAM_LOGIN;

  // The token
  constructor(public token: string) {}
}
export class DeepstreamLoginFailed implements Action {
  readonly type = DEEPSTREAM_LOGIN_FAILED;
  constructor(public error: any) {}
}

export class DeepstreamPermissionRecordChanged implements Action {
  readonly type = DEEPSTREAM_PERMISSION_RECORD_CHANGED;

  // The new permission record
  constructor(public permissionRecord: any) {}
}

export type AllActions =
  | DeepstreamLogin
  | DeepstreamLoginFailed
  | DeepstreamLoginSuccess
  | DeepstreamLogoutSuccess
  | DeepstreamPermissionRecordChanged
  | DeepstreamAuthSuccess;
