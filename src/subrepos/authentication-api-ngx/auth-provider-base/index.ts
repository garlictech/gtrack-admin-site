import { Http } from '@angular/http';

import { OauthWindowService } from '../oauth-window';
import { Deferred } from '../deferred';
import { AuthService } from '../auth';
import { log, DebugLog } from '../log';
import { IAuth } from '../store';

export class AuthProviderBase {
  protected deferred: Deferred = new Deferred();

  constructor(protected oauthWindow: OauthWindowService, protected http: Http, protected auth: AuthService) {}

  /**
   * Send oauth_token and oauth_secret to API for jwt token
   */
  @DebugLog
  public restApiLogin(accessToken: string, url: string, roles?: string[]): Promise<IAuth> {
    let options: any = {
      /* jshint camelcase: false */
      access_token: accessToken
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
  ): Promise<IAuth> {
    return this._login(loginUrl, redirectUri, permissions).then(response => {
      /* jshint camelcase: false */
      let accessToken = response.access_token;
      /* jshint camelcase: true */

      return this.restApiLogin(accessToken, tokenUrl, roles);
    });
  }

  @DebugLog
  protected _parseQueryString(queryString: string): any {
    queryString = decodeURIComponent(queryString);
    let obj: any = {};
    let params: string[] = queryString.split('&');

    for (let param of params) {
      let data: string[] = param.split('=');
      obj[data[0]] = data[1];
    }

    return obj;
  }

  @DebugLog
  protected _oauthCallback(url: string) {
    let data: any;
    let queryString: string;

    if (url.indexOf('access_token=') > 0) {
      queryString = url.substr(url.indexOf('#') + 1);
      data = this._parseQueryString(queryString);

      this.deferred.resolve(data);
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

  @DebugLog
  protected _login(loginUrl: string, redirectUri: string, permissions: string): Promise<any> {
    loginUrl += '&redirect_uri=' + redirectUri + '&response_type=token';

    if (permissions) {
      loginUrl += '&scope=' + permissions;
    }

    this.oauthWindow.open(loginUrl, 'access_token').then(url => {
      this._oauthCallback(url);

      return this.deferred.promise;
    });

    return this.deferred.promise;
  }
}
