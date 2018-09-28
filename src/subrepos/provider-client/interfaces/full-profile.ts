import { IUserData } from './user';
import { IPublicCommonProfile } from './profile';

export interface IFullUserData {
  user?: IUserData;
}

export interface IPublicProfile {
  user?: IPublicCommonProfile;
}
