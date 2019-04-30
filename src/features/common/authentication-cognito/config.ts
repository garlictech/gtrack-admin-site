import { InjectionToken } from '@angular/core';

export interface CognitoConfig {
  domain: string;
  region: string;
  responseType: 'token' | 'code';
  userPoolId: string;
  userPoolClientId: string;
  scope: Array<string>;
}

export const COGNITO_CONFIG = new InjectionToken<CognitoConfig>('AWS Cognito config');
