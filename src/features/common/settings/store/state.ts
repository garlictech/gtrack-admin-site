import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EnumValues } from 'enum-values';

import {
  CommonProfileSettings,
  PublicProfile,
  UserData
} from '@bit/garlictech.angular-features.common.gtrack-interfaces/interfaces';

import { EProfileGroup } from '../interfaces';

export interface ProfileWorkState {
  working: boolean;
  failed: any;
}

export interface PrivateProfileState {
  data: UserData;
  fetching: ProfileWorkState;
  profileGroups: {
    [s: string]: ProfileWorkState;
  };
}

export interface HikeProgramSettingsState {
  hikeDate: Date;
  speed: number;
}

const tomorrow = new Date();

tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9);
tomorrow.setMinutes(0);
tomorrow.setSeconds(0);
tomorrow.setMilliseconds(0);

export const defaultSettings: CommonProfileSettings = {
  messageSound: true,
  startTime: tomorrow,
  speed: 4
};

// Create the initial state based on profile groups
const _initialState: PrivateProfileState = {
  fetching: {
    working: false,
    failed: undefined
  },

  data: {
    profile: {
      settings: defaultSettings,
      basic: undefined as any
    }
  },

  profileGroups: {}
};

EnumValues.getValues(EProfileGroup).forEach(element => {
  _initialState.profileGroups[element] = {
    working: false,
    failed: undefined
  };
});

export const initialPrivateProfileState: PrivateProfileState = _initialState;

export const initialHikeProgramSettingsState: HikeProgramSettingsState = {
  hikeDate: tomorrow,
  speed: 4
};

// The public profiles as entities
export interface PublicProfileState extends PublicProfile, ProfileWorkState {
  id: string;
}

export interface PublicProfileWorkState extends ProfileWorkState {
  id: string;
}

export interface PublicProfileCollectionState extends EntityState<PublicProfileState> {}

export const publicProfileStateAdapter = createEntityAdapter<PublicProfileState>();

// The whole profile state
export interface SettingsState {
  privateProfile: PrivateProfileState;
  publicProfiles: PublicProfileCollectionState;
  hikeProgramSettings: HikeProgramSettingsState;
}

export const featureName = 'features.settings';
