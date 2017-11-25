export interface IFacebookConfig {
  version: string;
  permissions: string;
  appId: string;
  redirectUri?: string;
}

export interface IGoogleConfig {
  permissions: string;
  appId: string;
}

export interface IMagiclinkConfig {
  redirectSlug: string;
  redirectServerUrl?: string;
}

export interface IVerifyConfig {
  redirectSlug: string;
}

export interface IAuthenticationApiConfig {
  apiUrl: string;
  webserverUrl: string;
  authGuardRedirectSlug: string;
  twitter: boolean;
  magiclink: IMagiclinkConfig;
  facebook: IFacebookConfig;
  google: IGoogleConfig;
  firebase?: any;
}

export class AuthenticationApiConfig implements IAuthenticationApiConfig {
  apiUrl: string;
  webserverUrl: string;
  authGuardRedirectSlug = '/denied';
  twitter = true;
  magiclink: IMagiclinkConfig = {
    redirectSlug: '/magiclink'
  };
  verify: IVerifyConfig = {
    redirectSlug: '/verify'
  };
  facebook: IFacebookConfig = {
    version: '2.8',
    permissions: 'email',
    appId: null
  };
  google: IGoogleConfig = {
    permissions: 'email',
    appId: null
  };
  firebase: any;
}
