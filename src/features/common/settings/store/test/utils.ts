import { EntityState } from '@ngrx/entity';

import { SettingsState, HikeProgramSettingsState, PrivateProfileState, PublicProfileState } from '../state';

import { AuthenticationState } from '@features/common/authentication-api';

const date = new Date('2018-01-01');

export const initialHikeProgramSettingsState: HikeProgramSettingsState = {
  hikeDate: date,
  speed: 8
};

export const initialPrivateProfileState: PrivateProfileState = {
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

export const initialPublicProfile: PublicProfileState = {
  id: 'test',
  working: false,
  failed: null,
  user: {
    userName: 'test'
  }
};

export const initialPublicProfileState: EntityState<PublicProfileState> = {
  entities: {
    test: initialPublicProfile
  },
  ids: ['test']
};

export const initialAuthState: AuthenticationState = {
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
};

export const initialState: SettingsState = {
  privateProfile: initialPrivateProfileState,
  publicProfiles: initialPublicProfileState,
  hikeProgramSettings: initialHikeProgramSettingsState
};

export const createAuthState = (): AuthenticationState => ({
  ...initialAuthState
});

export const createFeatureState = (changes: Partial<SettingsState> = {}): SettingsState => ({
  ...initialState,
  ...changes
});

export interface TestState {
  authentication: {
    jwtAuth: AuthenticationState;
  };
  'features.settings': SettingsState;
}

export const createState = (stateParams?: Partial<SettingsState>): TestState => ({
  authentication: {
    jwtAuth: createAuthState()
  },
  'features.settings': createFeatureState(stateParams)
});
