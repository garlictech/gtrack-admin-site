import { User } from '../';
import * as firebase from 'firebase';

export interface IAuth {
  token: string;
  user: User;
  refreshToken: string;
  firebaseToken: string;
  firebaseUser: firebase.User;
}

export interface IAuthenticationState {
  auth: IAuth;
  loggingIn: boolean;
  failed: any;
  emailSent: boolean;
}

export const domain = 'authentication';
