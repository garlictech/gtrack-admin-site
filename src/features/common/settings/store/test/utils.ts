import { EntityState } from '@ngrx/entity';

import {
  featureName,
  HikeProgramSettingsState,
  PrivateProfileState,
  PublicProfileState,
  SettingsState
} from '../state';

import {
  AuthenticationState,
  featureName as authenticationFeatureName,
  JwtAuthState
} from '@bit/garlictech.angular-features.common.authentication/store/state';

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
      basic: null as any
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
  jwtAuth: {
    auth: {
      token: 'testtoken',
      user: {
        id: 'test',
        email: 'test@test.com',
        roles: ['user']
      }
    },
    loggingIn: false,
    failed: undefined,
    emailSent: false
  },
  uiState: {
    termsAccepted: false,
    selectedRole: 'user',
    loginRefused: false
  }
};

export const initialState: SettingsState = {
  privateProfile: initialPrivateProfileState,
  publicProfiles: initialPublicProfileState,
  hikeProgramSettings: initialHikeProgramSettingsState
};

export const createAuthState = (): AuthenticationState => ({
  ...initialAuthState
});

export const createJwtAuthState = (): JwtAuthState => ({
  ...initialAuthState.jwtAuth
});

export const createFeatureState = (changes: Partial<SettingsState> = {}): SettingsState => ({
  ...initialState,
  ...changes
});

export interface TestState {
  [authenticationFeatureName]: {
    jwtAuth: JwtAuthState;
  };
  [featureName]: SettingsState;
}

export const createState = (stateParams?: Partial<SettingsState>): TestState => ({
  [authenticationFeatureName]: {
    jwtAuth: createJwtAuthState()
  },
  [featureName]: createFeatureState(stateParams)
});
