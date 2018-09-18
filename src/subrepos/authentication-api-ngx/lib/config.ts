import { InjectionToken } from '@angular/core';

export interface IFacebookConfig {
  version: string;
  permissions: string;
  appId: string | null;
  redirectUri?: string;
}

export interface IGoogleConfig {
  permissions: string;
  appId: string | null;
}

export interface IMagiclinkConfig {
  redirectSlug: string;
  redirectServerUrl?: string;
}

export interface IVerifyConfig {
  redirectSlug: string;
}

export interface IAuthenticationApiConfig {
  apiUrl?: string;
  webserverUrl?: string;
  authGuardRedirectSlug: string;
  twitter: boolean;
  magiclink: IMagiclinkConfig;
  facebook: IFacebookConfig;
  google: IGoogleConfig;
  firebase?: any;

  verify: {
    redirectSlug: string;
  };
}

export const defaultAuthenticationApiConfig: IAuthenticationApiConfig = {
  authGuardRedirectSlug: '/denied',
  twitter: true,

  magiclink: {
    redirectSlug: '/magiclink'
  },

  verify: {
    redirectSlug: '/verify'
  },

  facebook: {
    version: '2.8',
    permissions: 'email',
    appId: null
  },

  google: {
    permissions: 'email',
    appId: null
  }
};

export const AUTH_CONFIG_TOKEN = new InjectionToken<IAuthenticationApiConfig>('Auth config');
