import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../auth';
import { AuthProviderBase } from '../auth-provider-base';
import { AUTH_CONFIG_TOKEN, AuthenticationApiConfig } from '../lib/config';
import { DebugLog } from '../log';
import { OauthWindowService } from '../oauth-window/oauth-window.service';
import { Auth } from '../store';
import { WindowService } from '../window';

@Injectable()
export class TwitterService extends AuthProviderBase {
  constructor(
    http: HttpClient,
    auth: AuthService,
    @Inject(AUTH_CONFIG_TOKEN) private readonly authConfig: AuthenticationApiConfig,
    oauthWindow: OauthWindowService,
    private readonly windowService: WindowService
  ) {
    super(oauthWindow, http, auth);
    this._init();
  }

  /**
   * Oauth callback called after success
   */
  @DebugLog oauthCallback(url: string): void {
    let data: any;
    let queryString: string;
    const accessTokenUrl = `${this.authConfig.apiUrl}/auth/twitter/oauth/access_token`;

    if (url.indexOf('oauth_token=') > 0) {
      queryString = url.substr(url.indexOf('?') + 1);
      data = this._parseQueryString(queryString);

      this.http
        .post(
          accessTokenUrl,
          {
            oauth_token: data.oauth_token,
            oauth_verifier: data.oauth_verifier
          },
          {
            responseType: 'text'
          }
        )
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
        data
      });

      this._subject.complete();
    }
  }

  /**
   * Do the complete twitter authentication process
   */
  @DebugLog connect(roles?: Array<string>): Observable<Auth> {
    return this.login().pipe(
      switchMap(response => {
        const oauthToken = response.oauth_token;
        const oauthSecret = response.oauth_token_secret;

        return this.restApiLogin(oauthToken, oauthSecret, roles);
      })
    );
  }

  @DebugLog verify(token: string, uid: string): Observable<any> {
    const tokenUrl = `${this.authConfig.apiUrl}/auth/twitter/verify`;

    return this.http
      .post<{
        token: string;
      }>(tokenUrl, {
        token,
        uid
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
  @DebugLog login(): Observable<any> {
    const redirectUri = `${this.authConfig.webserverUrl}/twitter/success.html`;
    const requestTokenProxy = `${this.authConfig.apiUrl}/auth/twitter/oauth/request_token`;

    // Avoid pop-up block
    this.oauthWindow.open('', 'oauth_verifier').subscribe(
      url => {
        this.oauthCallback(url);

        return this._subject.asObservable();
      },
      err => {
        this._subject.error(err);
        this._subject.complete();
      }
    );

    this.http
      .post(
        requestTokenProxy,
        {
          redirectUri
        },
        {
          responseType: 'text'
        }
      )
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

          oauthToken = requestTokenParams.oauth_token;
          oauthSecret = requestTokenParams.oauth_token_secret;

          loginUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=';
          loginUrl += oauthToken;
          loginUrl += '&oauth_token_secret=';
          loginUrl += `${oauthSecret}&oauth_callback_confirmed=true`;

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
  @DebugLog restApiLogin(oauthToken: string, oauthSecret: string, roles?: Array<string>): Observable<Auth> {
    const url = `${this.authConfig.apiUrl}/auth/twitter/token`;
    const body: any = {
      oauth_token: oauthToken,
      oauth_token_secret: oauthSecret
    };

    if (roles) {
      body.roles = roles;
    }

    return this.http
      .post<{
        token: string;
        refreshToken: string;
      }>(url, body)
      .pipe(
        switchMap(data => {
          const token = data.token;
          const refreshToken = data.refreshToken;

          return this.auth.init(token, refreshToken);
        })
      );
  }

  @DebugLog _init(): void {
    const window: any = this.windowService.nativeWindow;
    window.twitterOauthCallback = (url: string) => {
      this.oauthWindow.close();
      this.oauthCallback(url);
    };
  }
}
