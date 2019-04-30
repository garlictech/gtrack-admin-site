import { TestBed } from '@angular/core/testing';

import { DOCUMENT } from '@angular/common';
import { COGNITO_CONFIG } from '../../../config';
import { FacebookLoginService } from '../facebook-login.service';

const cognitoConfigMock = {
  domain: 'gtrack.auth.us-east-1.amazoncognito.com',
  region: 'us-east-1',
  responseType: 'token',
  userPoolId: 'us-east-1_2O173W10c',
  userPoolClientId: '2rp9tv9kkprvjs7i29kckg48ds',
  scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin']
};

describe('FacebookLoginService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: COGNITO_CONFIG, useValue: cognitoConfigMock },
        { provide: DOCUMENT, useFactory: () => document, deps: [] }
      ]
    })
  );

  it('should be created', () => {
    const service: FacebookLoginService = TestBed.get(FacebookLoginService);
    expect(service).toBeTruthy();
  });
});
