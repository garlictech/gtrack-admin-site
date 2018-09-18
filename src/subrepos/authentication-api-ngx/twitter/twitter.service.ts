import { mergeMap,  switchMap, take } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  throwError, of } from 'rxjs';

import { AuthService } from '../auth';
import { OauthWindowService } from '../oauth-window/oauth-window.service';
import { WindowService } from '../window';
import { IAuth } from '../store';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig } from '../lib/config';
import { DebugLog } from '../log';
import { AuthProviderBase } from '../auth-provider-base';

@Injectable()
export class TwitterService extends AuthProviderBase {
  constructor(
    http: HttpClient,
    auth: AuthService,
    @Inject(AUTH_CONFIG_TOKEN) private authConfig: IAuthenticationApiConfig,
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
    const accessTokenUrl = `${this.authConfig.apiUrl}/auth/twitter/oauth/access_token`;

    if (url.indexOf('oauth_token=') > 0) {
      queryString = url.substr(url.indexOf('?') + 1);
      data = this._parseQueryString(queryString);

      this.http
        .post(accessTokenUrl, {
          /* jshint camelcase: false */
          oauth_token: data.oauth_token,
          oauth_verifier: data.oauth_verifier,
          /* jshint camelcase: true */
        }, {
          responseType: 'text'
        })
        .subscribe(response => {
          const body = response.replace(/"(.*)"/, '$1');
          data = this._parseQueryString(body);

          this._subject.next(data);
          this._subject.complete();
        });
    } else {
      if (url.indexOf('error=') > 0) {
        queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
        data = this._parseQueryString(queryString);
      }

      this._subject.error({
        error: 'Not authorized',
        data: data
      });

      this._subject.complete();
    }
  }

  /**
   * Do the complete twitter authentication process
   */
  @DebugLog
  public connect(roles?: string[]): Observable<IAuth> {
    return this.login()
      .pipe(
        switchMap(response => {
          /* jshint camelcase: false */
          const oauthToken = response.oauth_token;
          const oauthSecret = response.oauth_token_secret;
          /* jshint camelcase: true */

          return this.restApiLogin(oauthToken, oauthSecret, roles);
        })
      );
  }

  @DebugLog
  public verify(token: string, uid: string): Observable<any> {
    const tokenUrl = `${this.authConfig.apiUrl}/auth/twitter/verify`;

    return this.http
      .post<{
        token: string
      }>(tokenUrl, {
        token: token,
        uid: uid
      })
      .pipe(
        switchMap(body => {
          const data = body;
          const authToken = data.token;

          return this.auth.init(authToken);
        })
      );
  }

  /**
   * Twitter Oauth login
   */
  @DebugLog
  public login(): Observable<any> {
    const redirectUri = `${this.authConfig.webserverUrl}/twitter/success.html`;
    const requestTokenProxy = `${this.authConfig.apiUrl}/auth/twitter/oauth/request_token`;

    // Avoid pop-up block
    this.oauthWindow
      .open('', 'oauth_verifier')
      .subscribe(url => {
        this.oauthCallback(url);

        return this._subject.asObservable();
      }, err => {
        this._subject.error(err);
        this._subject.complete();
      });

    this.http
      .post(requestTokenProxy, {
        redirectUri: redirectUri
      }, {
        responseType: 'text'
      })
      .pipe(
        mergeMap(response => {
          const queryString: string = response.replace(/"(.*)"/, '$1');
          const requestTokenParams: any = this._parseQueryString(queryString);
          let oauthToken: string;
          let oauthSecret: string;
          let loginUrl: string;

          if (requestTokenParams.hasOwnProperty('oauth_token') === false) {
            return throwError(new Error('Oauth request token was not received'));
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

          return of(undefined);
        }),
        take(1)
      )
      .subscribe(
        () => {
          // Empty
        },
        err => {
          this.oauthWindow.close();
          this._subject.error(err);
          this._subject.complete();
        }
      );

    return this._subject.asObservable();
  }

  /**
   * Send oauth_token and oauth_secret to API for jwt token
   */
  @DebugLog
  public restApiLogin(oauthToken: string, oauthSecret: string, roles?: string[]): Observable<IAuth> {
    const url = `${this.authConfig.apiUrl}/auth/twitter/token`;
    const body: any = {
      /* jshint camelcase: false */
      oauth_token: oauthToken,
      oauth_token_secret: oauthSecret
      /* jshint camelcase: true */
    };

    if (roles) {
      body.roles = roles;
    }

    return this.http
      .post<{
        token: string,
        refreshToken: string
      }>(url, body)
      .pipe(
        switchMap(data => {
          const token = data.token;
          const refreshToken = data.refreshToken;

          return this.auth.init(token, refreshToken);
        })
      );
  }

  @DebugLog
  private _init() {
    const window: any = this.windowService.nativeWindow;
    window.twitterOauthCallback = (url: string) => {
      this.oauthWindow.close();
      this.oauthCallback(url);
    };
  }
}
