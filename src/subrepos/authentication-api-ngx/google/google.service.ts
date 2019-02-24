import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../auth';
import { AuthProviderBase } from '../auth-provider-base';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig, IGoogleConfig } from '../lib/config';
import { DebugLog } from '../log';
import { OauthWindowService } from '../oauth-window';
import { IAuth } from '../store';
import { WindowService } from '../window';

@Injectable()
export class GoogleService extends AuthProviderBase {
  private googleApiUrl: string;
  private config: IGoogleConfig;

  constructor(
    @Inject(AUTH_CONFIG_TOKEN) private readonly authConfig: IAuthenticationApiConfig,
    auth: AuthService,
    oauthWindow: OauthWindowService,
    private readonly windowService: WindowService,
    http: HttpClient
  ) {
    super(oauthWindow, http, auth);
    this._init();
  }

  /**
   * Do the complete google authentication process
   */
  @DebugLog connect(roles?: Array<string>): Observable<IAuth> {
    return this._connect(
      `${this.googleApiUrl}?client_id=${this.config.appId}`,
      `${this.authConfig.webserverUrl}/google/success.html`,
      `${this.authConfig.apiUrl}/auth/google/token`,
      this.config.permissions,
      roles
    );
  }

  @DebugLog _init() {
    const window: any = this.windowService.nativeWindow;
    this.googleApiUrl = 'https://accounts.google.com/o/oauth2/auth';

    this.config = this.authConfig.google;

    window.googleOauthCallback = (url: string) => {
      this.oauthWindow.close();
      this.oauthCallback(url);
    };
  }
}
