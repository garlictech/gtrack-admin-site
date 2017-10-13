import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { OauthWindowService } from '../oauth-window';
import { AuthService } from '../auth';
import { WindowService } from '../window';
import { IAuth } from '../store';
import { AuthenticationApiConfig, IGoogleConfig } from '../lib/config';
import { DebugLog } from '../log';
import { AuthProviderBase } from '../auth-provider-base';

@Injectable()
export class GoogleService extends AuthProviderBase {
  private googleApiUrl: string;
  private config: IGoogleConfig;

  constructor(
    private authConfig: AuthenticationApiConfig,
    auth: AuthService,
    oauthWindow: OauthWindowService,
    private windowService: WindowService,
    http: Http
  ) {
    super(oauthWindow, http, auth);
    this._init();
  }

  /**
   * Do the complete google authentication process
   */
  @DebugLog
  public connect(roles?: string[]): Promise<IAuth> {
    return this._connect(
      `${this.googleApiUrl}?client_id=${this.config.appId}`,
      `${this.authConfig.webserverUrl}/google/success.html`,
      `${this.authConfig.apiUrl}/auth/google/token`,
      this.config.permissions,
      roles
    );
  }

  @DebugLog
  private _init() {
    let window: any = this.windowService.nativeWindow;
    this.googleApiUrl = 'https://accounts.google.com/o/oauth2/auth';

    this.config = this.authConfig.google;

    window.googleOauthCallback = (url: string) => {
      this._oauthCallback(url);
    };
  }
}
