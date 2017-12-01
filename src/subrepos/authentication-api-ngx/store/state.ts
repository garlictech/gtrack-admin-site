import { User } from '../';
import * as firebase from 'firebase';

export interface IAuth {
  token: string | null;
  user: User | null;
  refreshToken?: string | null;
  firebaseToken?: string | null;
  firebaseUser?: firebase.User;
}

export interface IAuthenticationState {
  auth: IAuth | null;
  loggingIn: boolean;
  failed: any | null;
  emailSent: boolean;
}

export const domain = 'authentication';
