import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import Amplify from 'aws-amplify';
import { COGNITO_CONFIG, CognitoConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {
  // Get access to window object in the Angular way
  private readonly _window: Window;
  private readonly _url: string;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    @Inject(COGNITO_CONFIG) private readonly _config: CognitoConfig
  ) {
    this._url = this._document.location.origin;
    this._window = this._document.defaultView;
    Amplify.configure({
      Auth: {
        userPoolId: this._config.userPoolId,
        userPoolWebClientId: this._config.userPoolClientId,
        oauth: {
          domain: this._config.domain,
          scope: this._config.scope,
          redirectSignIn: this._url,
          redirectSignOut: this._url,
          responseType: this._config.responseType
        }
      }
    });
  }

  async connect(roles?: Array<string>): Promise<void> {
    const domain = this._config.domain;
    const redirectSignIn = this._url;
    const responseType = this._config.responseType;
    const clientId = this._config.userPoolClientId;
    const urlToGoogle = `https://${domain}/oauth2/authorize?redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}&identity_provider=Google`;

    this._window.location.assign(urlToGoogle);
  }
}
