import { InjectionToken } from '@angular/core';

export interface FacebookConfig {
  version: string;
  permissions: string;
  appId: string | null;
  redirectUri?: string;
}

export interface GoogleConfig {
  permissions: string;
  appId: string | null;
}

export interface MagiclinkConfig {
  redirectSlug: string;
  redirectServerUrl?: string;
}

export interface VerifyConfig {
  redirectSlug: string;
}

export interface AuthenticationApiConfig {
  apiUrl?: string;
  webserverUrl?: string;
  authGuardRedirectSlug: string;
  twitter: boolean;
  magiclink: MagiclinkConfig;
  facebook: FacebookConfig;
  google: GoogleConfig;
  firebase?: any;

  verify: {
    redirectSlug: string;
  };
}

export const defaultAuthenticationApiConfig: AuthenticationApiConfig = {
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
    appId: undefined
  },

  google: {
    permissions: 'email',
    appId: undefined
  }
};

export const AUTH_CONFIG_TOKEN = new InjectionToken<AuthenticationApiConfig>('Auth config');
