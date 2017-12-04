import { IProviderInput } from './provider';

export interface IPublicCommonProfile extends IProviderInput {
  userName: string;
}

export interface ICommonProfile extends IPublicCommonProfile {
  firstName: string;
  lastName: string;
  birthDate: Date;
  nationality: string;
  gender: string;
  languages: string[];
  about: string;
}

export interface ICommonProfileBackend extends ICommonProfile, IProviderInput {}

export interface IUserProfileDelete extends IProviderInput {
  role: string;
}

export enum UserPermissionType {
  Public,
  Followers,
  OnlyMe
}

export interface ICommonProfileSettings extends IProviderInput {
  sound: {
    notification: boolean;
    message: boolean;
  };
  timeline: {
    whoCanAddThings: UserPermissionType;
    whoCanSeeThings: UserPermissionType;
    whoCanCommentMyPosts: UserPermissionType;
  };
}
