import { EAuthRoles } from './roles';

export interface CommonProfileSettings {
  messageSound: boolean;
  startTime?: Date;
  speed?: number;
}

export interface PublicCommonProfile {
  userName: string;
  profilePicture?: string;
  coverPicture?: string;
  followers?: Array<{
    userId: string;
    role: EAuthRoles;
  }>;
  following?: Array<{
    userId: string;
    role: EAuthRoles;
  }>;
}

export interface CommonProfile extends PublicCommonProfile {
  about?: string;
  markedObjects?: {
    [s: string]: Array<string>;
  };
}

export interface CommonProfileData<PROFILE> {
  firstRegistrationDate?: string;
  profile: PROFILE;
}
