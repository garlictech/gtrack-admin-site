import { IClientData } from '@garlictech/deepstream-rxjs';
import { IPermissionRecord } from '../../../provider-client';

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
  state: EDeepstreamState.LOGGING_IN,
  failure: null,
  auth: null,
  permissionRecord: null
};
