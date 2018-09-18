import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth';
import { IAuth } from '../store';
import { DebugLog } from '../log';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig, IMagiclinkConfig } from '../lib/config';

import { switchMap } from 'rxjs/operators';

interface RequestTokenParams {
  user: string;
  language?: string;
  redirectUri?: string;
  roles?: string[];
}

@Injectable()
export class PasswordlessService {
  private requestUrl: string;
  private tokenUrl: string;
  private redirectUri: URL;
  private config: IMagiclinkConfig;

  constructor(
    private auth: AuthService,
    @Inject(AUTH_CONFIG_TOKEN) private authConfig: IAuthenticationApiConfig,
    private http: HttpClient
  ) {
    this._init();
  }

  @DebugLog
  public requestToken(email: string, language?: string, roles?: string[]): Observable<Object> {
    const params: RequestTokenParams = {
      user: email,
      redirectUri: this.redirectUri.toString()
    };

    if (language) {
      params.language = language;
    }

    if (roles) {
      params.roles = roles;
    }

    return this.http.post(this.requestUrl, params);
  }

  @DebugLog
  public callback(passwordlessToken: string, uid: string, roles?: string[]): Observable<IAuth> {
    return this.http
      .post<{
        token: string,
        refreshToken: string
      }>(this.tokenUrl, {
        token: passwordlessToken,
        uid: uid.replace(/%40/, '@'),
        roles: roles
      })
      .pipe(
        switchMap(body => {
          const token = body.token;
          const refreshToken = body.refreshToken;

          return this.auth.init(token, refreshToken);
        })
      );
  }

  @DebugLog
  private _init() {
    this.config = { ...this.authConfig.magiclink };
    this.requestUrl = `${this.authConfig.apiUrl}/auth/passwordless/token/request`;
    this.tokenUrl = `${this.authConfig.apiUrl}/auth/passwordless/token`;
    this.redirectUri = new URL(`${this._redirectServerUrl}${this.config.redirectSlug}`);
  }

  private get _redirectServerUrl(): string | undefined {
    return this.config.redirectServerUrl || this.authConfig.webserverUrl;
  }
}
