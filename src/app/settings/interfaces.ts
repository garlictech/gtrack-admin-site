import { IPublicCommonProfile } from 'subrepos/provider-client/interfaces';

export enum EProfileGroup {
  basic = 'basic',
  settings = 'settings'
}

export interface IDecoratedPublicCommonProfile extends IPublicCommonProfile {
  profileUrl?: string;
}
