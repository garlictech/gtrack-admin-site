import { IProviderInput } from './provider';
import { EAuthRoles } from './roles';

export interface ICommonProfileSettings {
  messageSound: boolean;
}

export interface IPublicCommonProfile {
  userName: string;
  profilePicture?: string;
  coverPicture?: string;
  followers?: {
    userId: string;
    role: EAuthRoles;
  }[];
  following?: {
    userId: string;
    role: EAuthRoles;
  }[];
}

export interface ICommonProfile extends IPublicCommonProfile {
  about?: string;
  markedObjects?: {
    [s: string]: string[];
  };
}

export interface ICommonProfileData<PROFILE> {
  firstRegistrationDate?: string;
<<<<<<< HEAD
  profile: PROFILE;
=======
  settings: PROFILE;
>>>>>>> baacc3eb3bf5e65eae95c1d530d8341f6d0d0c25
}

export interface IProfileDelete extends IProviderInput {}
