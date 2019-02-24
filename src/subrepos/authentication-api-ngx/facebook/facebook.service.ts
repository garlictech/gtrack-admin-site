import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../auth';
import { AuthProviderBase } from '../auth-provider-base';
import { AUTH_CONFIG_TOKEN, IAuthenticationApiConfig, IFacebookConfig } from '../lib/config';
import { DebugLog } from '../log';
import { OauthWindowService } from '../oauth-window';
import { IAuth } from '../store';
import { WindowService } from '../window';

@Injectable()
export class FacebookService extends AuthProviderBase {
  private facebookApiUrl: string;
  private config: IFacebookConfig;

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
   * Do the complete facebook authentication process
   */
  @DebugLog connect(roles?: Array<string>): Observable<IAuth> {
    const redirectUri = this.config.redirectUri || `${this.authConfig.webserverUrl}/facebook/success.html`;

    return this._connect(
      `${this.facebookApiUrl}/dialog/oauth?client_id=${this.config.appId}`,
      redirectUri,
      `${this.authConfig.apiUrl}/auth/facebook/token`,
      this.config.permissions,
      roles
    );
  }

  @DebugLog _init() {
    this.config = this.authConfig.facebook;
    const window: any = this.windowService.nativeWindow;
    this.facebookApiUrl = `https://www.facebook.com/v${this.config.version}`;

    window.facebookOauthCallback = (url: string) => {
      this.oauthWindow.close();
      this.oauthCallback(url);
    };
  }
}
