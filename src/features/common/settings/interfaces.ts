import { PublicCommonProfile } from '@bit/garlictech.angular-features.common.gtrack-interfaces/interfaces';

export enum EProfileGroup {
  basic = 'basic',
  settings = 'settings'
}

export interface DecoratedPublicCommonProfile extends PublicCommonProfile {
  profileUrl?: string;
}
