import { IClientData } from '@garlictech/deepstream-rxjs';

export interface IDeepstreamState {
  state: string;
  failure: any;
  auth: IClientData;
  permissionRecord: any;
}

export const initialState: IDeepstreamState = {
  state: 'unknown',
  failure: null,
  auth: null,
  permissionRecord: null
};
