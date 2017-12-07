import { IClientData } from '@garlictech/deepstream-rxjs';

export enum EDeepstreamState {
  LOGGING_IN,
  LOGGED_OUT,
  LOGGED_IN
}

export interface IDeepstreamState {
  state: EDeepstreamState;
  failure: any;
  auth: IClientData | null;
  permissionRecord: any;
}

export const initialState: IDeepstreamState = {
  state: EDeepstreamState.LOGGED_OUT,
  failure: null,
  auth: null,
  permissionRecord: null
};
