import { User } from '../interfaces';

export interface Auth {
  token: string | null;
  user: User | null;
  refreshToken?: string | null;
}

export interface UiState {
  termsAccepted: boolean;
  selectedRole: string;
  loginRefused: boolean;
}

export interface JwtAuthState {
  auth: Auth | null;
  loggingIn: boolean;
  failed: any | null;
  emailSent: boolean;
}

export interface AuthenticationState {
  jwtAuth: JwtAuthState;
  uiState: UiState;
}

export const featureName = 'features.common.authentication';
