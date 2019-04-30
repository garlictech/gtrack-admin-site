import { TestBed } from '@angular/core/testing';

import { COGNITO_CONFIG } from '../../../config';
import { PasswordlessLoginService } from '../passwordless-login.service';

const cognitoConfigMock = {
  domain: 'gtrack.auth.us-east-1.amazoncognito.com',
  region: 'us-east-1',
  responseType: 'token',
  userPoolId: 'us-east-1_2O173W10c',
  userPoolClientId: '2rp9tv9kkprvjs7i29kckg48ds',
  scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin']
};

describe('PasswordlessLoginService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [{ provide: COGNITO_CONFIG, useValue: cognitoConfigMock }] })
  );

  it('should be created', () => {
    const service: PasswordlessLoginService = TestBed.get(PasswordlessLoginService);
    expect(service).toBeTruthy();
  });
});
