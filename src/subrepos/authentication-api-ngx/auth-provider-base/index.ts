import { HttpClient } from '@angular/common/http';

import { OauthWindowService } from '../oauth-window';
import { AuthService } from '../auth';
import { DebugLog, log } from '../log';
import { IAuth } from '../store';

import { Observable, ReplaySubject, of } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';

export class AuthProviderBase {
  protected _subject: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(protected oauthWindow: OauthWindowService, protected http: HttpClient, protected auth: AuthService) {}

  /**
   * Send oauth_token and oauth_secret to API for jwt token
   */
  @DebugLog
  public restApiLogin(accessToken: string, url: string, roles?: string[]): Observable<IAuth> {
    const body: any = {
      /* jshint camelcase: false */
      access_token: accessToken,
      /* jshint camelcase: true */
    };

    if (roles) {
      body.roles = roles;
    }

    log.data('Rest api login: ', url);

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

  /**
   * Do the complete facebook authentication process
   */
  @DebugLog
  protected _connect(
    loginUrl: string,
    redirectUri: string,
    tokenUrl: string,
    permissions: string,
    roles?: string[]
  ): Observable<IAuth> {
    return this._login(loginUrl, redirectUri, permissions)
      .pipe(
        take(1),
        switchMap(response => {
          /* jshint camelcase: false */
          const accessToken = response.access_token;
          /* jshint camelcase: true */

          return this.restApiLogin(accessToken, tokenUrl, roles);
        })
      );
  }

  @DebugLog
  protected _parseQueryString(queryString: string): any {
    queryString = decodeURIComponent(queryString);
    const obj: any = {};
    const params: string[] = queryString.split('&');

    for (const param of params) {
      const data: string[] = param.split('=');
      obj[data[0]] = data[1];
    }

    return obj;
  }

  @DebugLog
  public oauthCallback(url: string) {
    let data: any;
    let queryString: string;

    if (url.indexOf('access_token=') > 0) {
      queryString = url.substr(url.indexOf('#') + 1);
      data = this._parseQueryString(queryString);

      this._subject.next(data);
      this._subject.complete();
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

  @DebugLog
  protected _login(loginUrl: string, redirectUri: string, permissions: string): Observable<any> {
    loginUrl += '&redirect_uri=' + redirectUri + '&response_type=token';

    if (permissions) {
      loginUrl += '&scope=' + permissions;
    }

    this.oauthWindow
      .open(loginUrl, 'access_token')
      .pipe(
        take(1),
        switchMap(url => {
          this.oauthCallback(url);

          return this._subject.asObservable();
        }),
        catchError(err => {
          this._subject.error(err);
          this._subject.complete();

          return of(undefined);
        })
      )
      .subscribe();

    return this._subject.asObservable();
  }
}
