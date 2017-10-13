import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { AuthService } from '../auth';
import { OauthWindowService } from '../oauth-window/oauth-window.service';
import { WindowService } from '../window';
import { IAuth } from '../store';
import { AuthenticationApiConfig } from '../lib/config';
import { DebugLog } from '../log';
import { AuthProviderBase } from '../auth-provider-base';

@Injectable()
export class TwitterService extends AuthProviderBase {
  constructor(
    http: Http,
    auth: AuthService,
    private authConfig: AuthenticationApiConfig,
    oauthWindow: OauthWindowService,
    private windowService: WindowService
  ) {
    super(oauthWindow, http, auth);
    this._init();
  }

  /**
   * Oauth callback called after success
   */
  @DebugLog
  public oauthCallback(url: string): void {
    let data: any = null;
    let queryString: string;
    let accessTokenUrl = `${this.authConfig.apiUrl}/auth/twitter/oauth/access_token`;

    if (url.indexOf('oauth_token=') > 0) {
      queryString = url.substr(url.indexOf('?') + 1);
      data = this._parseQueryString(queryString);

      this.http
        .post(accessTokenUrl, {
          /* jshint camelcase: false */
          oauth_token: data.oauth_token,
          oauth_verifier: data.oauth_verifier
          /* jshint camelcase: true */
        })
        .toPromise()
        .then((response: Response) => {
          let body = response.text().replace(/"(.*)"/, '$1');
          data = this._parseQueryString(body);

          this.deferred.resolve(data);
        });
    } else {
      if (url.indexOf('error=') > 0) {
        queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
        data = this._parseQueryString(queryString);
      }

      this.deferred.reject({
        error: 'Not authorized',
        data: data
      });
    }
  }

  /**
   * Do the complete twitter authentication process
   */
  @DebugLog
  public connect(roles?: string[]): Promise<IAuth> {
    return this.login().then(response => {
      /* jshint camelcase: false */
      let oauthToken = response.oauth_token;
      let oauthSecret = response.oauth_token_secret;
      /* jshint camelcase: true */

      return this.restApiLogin(oauthToken, oauthSecret, roles);
    });
  }

  @DebugLog
  public verify(token: string, uid: string): Promise<any> {
    let tokenUrl = `${this.authConfig.apiUrl}/auth/twitter/verify`;

    return this.http
      .post(tokenUrl, {
        token: token,
        uid: uid
      })
      .toPromise()
      .then((response: Response) => {
        let body = response.json();
        let data = body;
        let authToken = data.token;

        return this.auth.init(authToken);
      });
  }

  /**
   * Twitter Oauth login
   */
  @DebugLog
  public login(): Promise<any> {
    let redirectUri = `${this.authConfig.webserverUrl}/twitter/success.html`;
    let requestTokenProxy = `${this.authConfig.apiUrl}/auth/twitter/oauth/request_token`;

    // Avoid pop-up block
    this.oauthWindow.open('', 'oauth_verifier').then(url => {
      this.oauthCallback(url);

      return this.deferred.promise;
    });

    this.http
      .post(requestTokenProxy, {
        redirectUri: redirectUri
      })
      .toPromise()
      .then(response => {
        let queryString: string = response.text().replace(/"(.*)"/, '$1');
        let requestTokenParams: any = this._parseQueryString(queryString);
        let oauthToken: string;
        let oauthSecret: string;
        let loginUrl: string;

        if (requestTokenParams.hasOwnProperty('oauth_token') === false) {
          return Promise.reject(new Error('Oauth request token was not received'));
        }

        /*jshint camelcase: false */
        oauthToken = requestTokenParams.oauth_token;
        oauthSecret = requestTokenParams.oauth_token_secret;
        /*jshint camelcase: true */

        loginUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=';
        loginUrl += oauthToken;
        loginUrl += '&oauth_token_secret=';
        loginUrl += oauthSecret + '&oauth_callback_confirmed=true';

        this.oauthWindow.changeUrl(loginUrl);
      })
      .catch(err => {
        this.oauthWindow.close();
        this.deferred.reject(err);
      });

    return this.deferred.promise;
  }

  /**
   * Send oauth_token and oauth_secret to API for jwt token
   */
  @DebugLog
  public restApiLogin(oauthToken: string, oauthSecret: string, roles?: string[]): Promise<IAuth> {
    let url = `${this.authConfig.apiUrl}/auth/twitter/token`;
    let options: any = {
      /* jshint camelcase: false */
      oauth_token: oauthToken,
      oauth_token_secret: oauthSecret
      /* jshint camelcase: true */
    };

    if (roles) {
      options.roles = roles;
    }

    return this.http.post(url, options).toPromise().then(response => {
      let body = response.json();
      let data = body;
      let token = data.token;
      let refreshToken = data.refreshToken;
      return this.auth.init(token, refreshToken);
    });
  }

  @DebugLog
  private _init() {
    let window: any = this.windowService.nativeWindow;
    window.twitterOauthCallback = (url: string) => {
      this.oauthCallback(url);
    };
  }
}
