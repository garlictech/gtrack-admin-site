import { User } from '../interfaces';

export interface Auth {
  token: string | null;
  user: User | null;
  refreshToken?: string | null;
}

export interface AuthenticationState {
  auth: Auth | null;
  loggingIn: boolean;
  failed: any | null;
  emailSent: boolean;
}

export const domain = 'authentication';
