import { PublicCommonProfile } from './profile';
import { UserData } from './user';

export interface FullUserData {
  user?: UserData;
}

export interface PublicProfile {
  user?: PublicCommonProfile;
}
