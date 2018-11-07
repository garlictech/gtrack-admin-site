import { EnumValues } from 'enum-values';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { IUserData, ICommonProfileSettings, IPublicProfile } from 'subrepos/provider-client/interfaces';

import { EProfileGroup } from '../interfaces';

export interface IProfileWorkState {
  working: boolean;
  failed: any;
}

export interface IPrivateProfileState {
  data: IUserData;
  fetching: IProfileWorkState;
  profileGroups: {
    [s: string]: IProfileWorkState;
  };
}

export interface IHikeProgramSettingsState {
  hikeDate: Date;
}

const tomorrow = new Date();

tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9);
tomorrow.setMinutes(0);
tomorrow.setSeconds(0);
tomorrow.setMilliseconds(0);

export const defaultSettings: ICommonProfileSettings = {
  messageSound: true,
  startTime: tomorrow
};

// Create the initial state based on profile groups
const _initialState: IPrivateProfileState = {
  fetching: {
    working: false,
    failed: null
  },

  data: {
    profile: {
      settings: defaultSettings,
      basic: <any>null
    }
  },

  profileGroups: {}
};

EnumValues.getValues(EProfileGroup).forEach(element => {
  _initialState.profileGroups[element] = {
    working: false,
    failed: null
  };
});

export const initialPrivateProfileState: IPrivateProfileState = _initialState;

export const initialHikeProgramSettingsState: IHikeProgramSettingsState = {
  hikeDate: tomorrow
};

// The public profiles as entities
export interface IPublicProfileState extends IPublicProfile, IProfileWorkState {}

export interface IPublicProfileWorkState extends IProfileWorkState {
  id: string;
}

export interface IPublicProfileCollectionState extends EntityState<IPublicProfileState | IPublicProfileWorkState> {}

export const publicProfileStateAdapter = createEntityAdapter<IPublicProfileState | IPublicProfileWorkState>();

// The whole profile state
export interface ISettingsState {
  privateProfile: IPrivateProfileState;
  publicProfiles: IPublicProfileCollectionState;
  hikeProgramSettings: IHikeProgramSettingsState;
}
