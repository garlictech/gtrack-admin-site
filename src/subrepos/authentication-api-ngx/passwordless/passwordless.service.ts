import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig, IMagiclinkConfig } from '../lib/config';
import { DebugLog } from '../log';
import { IAuth } from '../store';

import { switchMap } from 'rxjs/operators';

interface RequestTokenParams {
  user: string;
  language?: string;
  redirectUri?: string;
  roles?: Array<string>;
}

@Injectable()
export class PasswordlessService {
  private requestUrl: string;
  private tokenUrl: string;
  private redirectUri: string;
  private config: IMagiclinkConfig;

  constructor(
    private readonly auth: AuthService,
    @Inject(AUTH_CONFIG_TOKEN) private readonly authConfig: IAuthenticationApiConfig,
    private readonly http: HttpClient
  ) {
    this._init();
  }

  @DebugLog requestToken(email: string, language?: string, roles?: Array<string>): Observable<Object> {
    const params: RequestTokenParams = {
      user: email,
      redirectUri: this.redirectUri
    };

    if (language) {
      params.language = language;
    }

    if (roles) {
      params.roles = roles;
    }

    return this.http.post(this.requestUrl, params);
  }

  @DebugLog callback(passwordlessToken: string, uid: string, roles?: Array<string>): Observable<IAuth> {
    return this.http
      .post<{
        token: string;
        refreshToken: string;
      }>(this.tokenUrl, {
        token: passwordlessToken,
        uid: uid.replace(/%40/, '@'),
        roles
      })
      .pipe(
        switchMap(body => {
          const token = body.token;
          const refreshToken = body.refreshToken;

          return this.auth.init(token, refreshToken);
        })
      );
  }

  @DebugLog _init() {
    this.config = { ...this.authConfig.magiclink };
    this.requestUrl = `${this.authConfig.apiUrl}/auth/passwordless/token/request`;
    this.tokenUrl = `${this.authConfig.apiUrl}/auth/passwordless/token`;
    this.redirectUri = `${this._redirectServerUrl}${this.config.redirectSlug}`;
  }

  private get _redirectServerUrl(): string | undefined {
    return this.config.redirectServerUrl || this.authConfig.webserverUrl;
  }
}
