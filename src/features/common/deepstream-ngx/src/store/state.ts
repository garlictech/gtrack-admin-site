import { PermissionRecord } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { IClientData } from '@garlictech/deepstream-rxjs';

export enum EDeepstreamState {
  LOGGING_IN,
  LOGGED_OUT,
  LOGGED_IN
}

export interface DeepstreamState {
  state: EDeepstreamState;
  failure: any;
  auth?: IClientData;
  permissionRecord?: PermissionRecord;
}

export const initialState: DeepstreamState = {
  state: EDeepstreamState.LOGGING_IN,
  failure: undefined,
  auth: undefined,
  permissionRecord: undefined
};

export const featureName = 'deepstream';
