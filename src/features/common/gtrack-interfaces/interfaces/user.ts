import { CommonProfile, CommonProfileData, CommonProfileSettings } from './profile';
import { ProviderInput } from './provider';

export interface UserProfileBasic extends CommonProfile {
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  languages?: Array<string>;
}

export interface UserProfile {
  basic: UserProfileBasic;
  settings: CommonProfileSettings;
}

export interface UserData extends CommonProfileData<UserProfile> {}

export interface UserProfileBasicInput extends UserProfileBasic, ProviderInput {}
export interface UserProfileSettingsInput extends CommonProfileSettings, ProviderInput {}
