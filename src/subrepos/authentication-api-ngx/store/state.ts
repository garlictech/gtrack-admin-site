import { User } from '../interfaces';

export interface IAuth {
  token: string | null;
  user: User | null;
  refreshToken?: string | null;
}

export interface IAuthenticationState {
  auth: IAuth | null;
  loggingIn: boolean;
  failed: any | null;
  emailSent: boolean;
}

export const domain = 'authentication';
