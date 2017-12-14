import { IClientData } from '@garlictech/deepstream-rxjs';
import { IPermissionRecord } from 'subrepos/provider-client';

export enum EDeepstreamState {
  LOGGING_IN,
  LOGGED_OUT,
  LOGGED_IN
}

export interface IDeepstreamState {
  state: EDeepstreamState;
  failure: any;
  auth: IClientData | null;
  permissionRecord: IPermissionRecord | null;
}

export const initialState: IDeepstreamState = {
  state: EDeepstreamState.LOGGED_OUT,
  failure: null,
  auth: null,
  permissionRecord: null
};
