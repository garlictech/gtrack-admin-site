import { EAuthRoles } from './roles';

export interface ICommonProfileSettings {
  messageSound: boolean;
  startTime?: {
    hour?: number;
    minute?: number;
  };
  speed?: number;
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
  profile: PROFILE;
}
