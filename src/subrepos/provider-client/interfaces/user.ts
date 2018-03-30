import { IProviderInput } from './provider';
import { EAuthRoles } from './roles';
import { IPublicCommonProfile, ICommonProfile, ICommonProfileSettings, ICommonProfileData } from './profile';

export interface IPublicUserProfile extends IPublicCommonProfile {}

export interface IUserProfileBasic extends ICommonProfile {
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  languages?: string[];
}

export interface IUserProfileSettings extends ICommonProfileSettings {}

export interface IUserProfile {
  basic: IUserProfileBasic;
  settings: IUserProfileSettings;
}

export interface IUserData extends ICommonProfileData<IUserProfile> {}

export interface IUserProfileBasicInput extends IUserProfileBasic, IProviderInput {}
export interface IUserProfileSettingsInput extends IUserProfileSettings, IProviderInput {}
