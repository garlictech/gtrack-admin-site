import { EntityState } from '@ngrx/entity';

import {
  ISettingsState,
  IHikeProgramSettingsState,
  IPrivateProfileState,
  IPublicProfileState,
  IPublicProfileWorkState,
  publicProfileStateAdapter
} from '../state';

import { IAuthenticationState } from 'subrepos/authentication-api-ngx';

const date = new Date('2018-01-01');

export const initialHikeProgramSettingsState: IHikeProgramSettingsState = {
  hikeDate: date,
  speed: 8
};

export const initialPrivateProfileState: IPrivateProfileState = {
  fetching: {
    working: false,
    failed: null
  },
  data: {
    profile: {
      settings: {
        messageSound: false,
        startTime: date,
        speed: 2
      },
      basic: <any>null
    }
  },
  profileGroups: {}
};

export const initialPublicProfile: IPublicProfileState = {
  id: 'test',
  working: false,
  failed: null,
  user: {
    userName: 'test'
  }
};

export const initialPublicProfileState: EntityState<IPublicProfileState> = {
  entities: {
    test: initialPublicProfile
  },
  ids: ['test']
};

export const initialAuthState: IAuthenticationState = {
  auth: {
    user: {
      id: 'test',
      email: 'test@test.com',
      createdAt: date,
      facebookId: '',
      lastLogin: date,
      modifiedAt: date,
      roles: ['user'],
      verified: true      
    },
    token: 'testtoken'
  },
  loggingIn: false,
  failed: null,
  emailSent: false
}

export const initialState: ISettingsState  = {
  privateProfile: initialPrivateProfileState,
  publicProfiles: initialPublicProfileState,
  hikeProgramSettings: initialHikeProgramSettingsState
};

export const createAuthState = (): IAuthenticationState => ({
  ...initialAuthState
});

export const createFeatureState = (changes: Partial<ISettingsState> = {}): ISettingsState => ({
  ...initialState,
  ...changes
});

export interface TestState {
  authentication: {
    jwtAuth: IAuthenticationState
  },
  'features.settings': ISettingsState
};

export const createState = (stateParams?: Partial<ISettingsState>): TestState => ({
  authentication: {
    jwtAuth: createAuthState()
  },
  'features.settings': createFeatureState(stateParams)
});
