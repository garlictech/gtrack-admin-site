import { IProviderInput } from './provider';
import { ICommonProfile, ICommonProfileSettings, ICommonProfileData } from './profile';

export interface IUserProfileBasic extends ICommonProfile {
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  languages?: string[];
}

export interface IUserProfile {
  basic: IUserProfileBasic;
  settings: ICommonProfileSettings;
}

export interface IUserData extends ICommonProfileData<IUserProfile> {}

export interface IUserProfileBasicInput extends IUserProfileBasic, IProviderInput {}
export interface IUserProfileSettingsInput extends ICommonProfileSettings, IProviderInput {}
