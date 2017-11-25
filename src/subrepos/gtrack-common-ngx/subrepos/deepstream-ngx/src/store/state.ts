import { IClientData } from '@garlictech/deepstream-rxjs';

export interface IDeepstreamState {
  state: string;
  failure: any;
  auth: IClientData;
  permissionRecord: any;
}
