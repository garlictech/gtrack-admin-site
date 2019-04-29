// tslint:disable:no-property-initializers max-classes-per-file
import {
  CommonProfile,
  CommonProfileSettings,
  EAuthRoles,
  PublicProfile,
  UserData
} from '@bit/garlictech.angular-features.common.gtrack-interfaces/interfaces';
import { Action } from '@ngrx/store';
import { EProfileGroup } from '../interfaces';

export const SETTINGS_FETCH_START = '[Settings] Start fetching settings';
export const SETTINGS_FETCH_SUCCESS = '[Settings] settings fetched';
export const SETTINGS_NOT_EXISTS = '[Settings] settings does not exist';
export const SETTINGS_SAVE_START = '[Settings] start saving settings';
export const SETTINGS_FETCH_FAILURE = '[Settings] settings fetch failure';
export const SETTINGS_SAVE_SUCCESS = '[Settings] Settings saved';
export const SETTINGS_SAVE_FAILURE = '[Settings] Save failure happened';
export const PUBLIC_PROFILE_FETCH_START = '[Settings] Start fetching public profile';
export const PUBLIC_PROFILE_FETCHED = '[Settings] Public profile fetching success';
export const PUBLIC_PROFILE_FETCH_FAILED = '[Settings] Public profile fetching failed';
export const SETTINGS_CHANGE_HIKE_PROGRAM_DATE = '[Settings] Change hikeProgram start date';
export const SETTINGS_CHANGE_HIKE_PROGRAM_SPEED = '[Settings] Change hikeProgram speed';

export class SettingsFetchStart implements Action {
  readonly type = SETTINGS_FETCH_START;
}

export class SettingsNotExists implements Action {
  readonly type = SETTINGS_NOT_EXISTS;
  // The settings group ID
  constructor(public profileGroup: EProfileGroup) {}
}

export class SettingsFetchSuccess implements Action {
  readonly type = SETTINGS_FETCH_SUCCESS;
  // The settings group ID
  constructor(public data: UserData) {}
}

export class SettingsSaveStart implements Action {
  readonly type = SETTINGS_SAVE_START;
  // The settings group ID
  constructor(public profileGroup: EProfileGroup, public data: CommonProfile | CommonProfileSettings) {}
}

export class SettingsSaveSuccess implements Action {
  readonly type = SETTINGS_SAVE_SUCCESS;
  // The settings group ID
  constructor(public profileGroup: EProfileGroup) {}
}

export class SettingsSaveFailure implements Action {
  readonly type = SETTINGS_SAVE_FAILURE;
  // The settings group ID
  constructor(public error: any, public profileGroup: EProfileGroup) {}
}

export class SettingsFetchFailure implements Action {
  readonly type = SETTINGS_FETCH_FAILURE;
  // The settings group ID
  constructor(public error: any) {}
}
export class PublicProfileFetchStart implements Action {
  readonly type = PUBLIC_PROFILE_FETCH_START;
  constructor(public id: string, public role: EAuthRoles) {}
}

export class PublicProfileFetched implements Action {
  readonly type = PUBLIC_PROFILE_FETCHED;
  constructor(public settings: PublicProfile, public id: string) {}
}

export class PublicProfileFetchFailed implements Action {
  readonly type = PUBLIC_PROFILE_FETCH_FAILED;
  constructor(public error: any) {}
}

export class ChangeHikeProgramStartDate implements Action {
  readonly type = SETTINGS_CHANGE_HIKE_PROGRAM_DATE;
  constructor(public startDate: Date) {}
}

export class ChangeHikeProgramSpeed implements Action {
  readonly type = SETTINGS_CHANGE_HIKE_PROGRAM_SPEED;

  constructor(public speed: number) {}
}

export type AllActions =
  | SettingsFetchStart
  | SettingsFetchSuccess
  | SettingsSaveStart
  | SettingsSaveSuccess
  | SettingsSaveFailure
  | SettingsFetchFailure
  | SettingsNotExists
  | PublicProfileFetchStart
  | PublicProfileFetched
  | PublicProfileFetchFailed
  | ChangeHikeProgramStartDate
  | ChangeHikeProgramSpeed;
