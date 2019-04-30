// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import Amplify, { Auth, Cache } from 'aws-amplify';
import { COGNITO_CONFIG, CognitoConfig } from '../../config';

const intToHex = (nr: number): string => nr.toString(16).padStart(2, '0');
@Injectable({
  providedIn: 'root'
})
export class PasswordlessLoginService {
  private cognitoUser: CognitoUser & { challengeParam: { email: string } };

  // Get access to window object in the Angular way
  private readonly _window: Window;
  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    @Inject(COGNITO_CONFIG) private readonly _config: CognitoConfig
  ) {
    this._window = this._document.defaultView;

    Amplify.configure({
      Auth: {
        region: this._config.region,
        userPoolId: this._config.userPoolId,
        userPoolWebClientId: this._config.userPoolClientId
      }
    });
  }

  async signIn(email: string): Promise<void> {
    // this.cognitoUser = await Auth.signIn(email);
    // Cache.setItem('cognitoUser', this.cognitoUser);
    // console.log('COGNITOUSER AFTER SIGNIN:', this.cognitoUser);

    return Auth.signIn(email).then(user => {
      this.cognitoUser = user;
      Cache.removeItem('cognitoUser');
      Cache.setItem('cognitoUser', user);
    });
  }

  async signOut(): Promise<void> {
    await Auth.signOut();
  }

  async answerCustomChallenge(answer: string): Promise<boolean> {
    if (!this.cognitoUser) {
      // this.cognitoUser = Cache.getItem('cognitoUser');
      // console.log('COGNITOUSER FROM CACHE:', this.cognitoUser);
      this.setUserFromCache();
      // this.cognitoUser = Auth.getCurrent
    }
    console.log('COGNITOUSER FROM CACHE:', this.cognitoUser);
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(this.cognitoUser, answer);
    console.log('COGNITOUSER AFTER CHALLENGE:', this.cognitoUser);

    return this.isAuthenticated();
  }

  async getPublicChallengeParameters(): Promise<any> {
    return this.cognitoUser.challengeParam;
  }

  async signUp(email: string): Promise<void> {
    const params = {
      username: email,
      password: this.getRandomString(30),
      attributes: {
        name: 'Teszt Elek',
        'custom:roles': 'user'
      }
    };
    await Auth.signUp(params).catch(err => {
      console.log('******', err);
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return Auth.currentSession()
      .then(() => true)
      .catch(() => false);
  }

  async getUserDetails(): Promise<any> {
    if (!this.cognitoUser) {
      this.cognitoUser = await Auth.currentAuthenticatedUser();
    }

    return Auth.userAttributes(this.cognitoUser);
  }

  private getRandomString(bytes: number): string {
    const randomValues = new Uint8Array(bytes);
    this._window.crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
      .map(intToHex)
      .join('');
  }

  private setUserFromCache(): void {
    const user = Cache.getItem('cognitoUser');
    // user.pool = Object.assign(Object.create(CognitoUserPool.prototype), user.pool);
    // this.cognitoUser = Object.assign(Object.create(CognitoUser.prototype), user);
    // console.log('NEW COGNITO USER FROM CACHE WITH PROTOTYPE PLS:', this.cognitoUser);

    const userPoolData = {
      UserPoolId: user.pool.userPoolId,
      ClientId: user.pool.clientId
    };
    const userPool = new CognitoUserPool(userPoolData);
    const userData = {
      Username: user.username,
      Pool: userPool
    };

    // const cognitoUser = {
    //   ...new CognitoUser(userData),
    //   Session: user.Session,
    //   challengeParam: { email: user.challengeParam.email }
    // };

    const cognitoUser = new CognitoUser(userData);
    // tslint:disable:no-string-literal
    // cognitoUser['Session'] = user.Session;
    // cognitoUser['challengeParam'] = user.challengeParam;
    // cognitoUser['challengeName'] = user.challengeName;
    // cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

    // this.cognitoUser = Object.assign(cognitoUser, user);
    this.cognitoUser = { ...cognitoUser, ...user };
    console.log('NEW COGNITO USER FROM CACHE:', cognitoUser);
  }
}
