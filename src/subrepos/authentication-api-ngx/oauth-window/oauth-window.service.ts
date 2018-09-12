import { Injectable } from '@angular/core';
import { Deferred } from '../deferred';
import { WindowService } from '../window';

import { LoginError, LoginErrorCodes } from '../errors/login-error';

@Injectable()
export class OauthWindowService {
  private _deferred: Deferred = new Deferred();
  private _startTime: number;
  private _loginWindow: any;
  private _window: any;

  // NOTE: any is required here becuase typescript incorrectly want to use NodeJS.Timer for setInterval's return value instead of number
  private _pollTimer: any;

  constructor(private windowService: WindowService) {
    this._window = this.windowService.nativeWindow;
  }

  public isOpened(): boolean {
    if (this._loginWindow) {
      return true;
    }

    return false;
  }

  /**
   * Open new login pop-up
   */
  public open(loginUrl: string, parameter = 'access_token'): Promise<any> {
    this._startTime = new Date().getTime();

    if (this._loginWindow && this._loginWindow.closed !== true) {
      this._loginWindow.removeEventListener('loadstart', this.loadStartHandler);
      this._loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
      this._loginWindow.close();
      this._loginWindow = null;

      const err = new LoginError('OAuth window reopened');
      err.code = LoginErrorCodes.REOPENED;

      this._deferred.reject(err);
    }

    this._deferred = new Deferred();

    this._loginWindow = this._window.open(loginUrl, '_blank', 'location=no');

    this._startPolling(this._loginWindow);

    this._loginWindow.addEventListener('loadstart', (e: any) => {
      // NOTE: If this is a cordova app we should cancel the polling
      clearInterval(this._pollTimer);
      this.loadStartHandler(e, parameter);
    });

    this._loginWindow.addEventListener('exit', () => {
      clearInterval(this._pollTimer);
      this.loginWindowExitHandler();
    });

    return this._deferred.promise;
  }

  /**
   * Change window URL
   */
  public changeUrl(url: string): void {
    if (this._loginWindow) {
      if (typeof this._loginWindow.executeScript === 'function') {
        this._loginWindow.executeScript({
          code: "window.location.href='" + url + "';"
        });
      } else {
        this._loginWindow.location.href = url;
        this._loginWindow.focus();
      }
    }
  }

  public close(): void {
    if (this._loginWindow) {
      clearInterval(this._pollTimer);
      this._loginWindow.close();
    }
  }

  private _startPolling(window): void {
    clearInterval(this._pollTimer);

    this._pollTimer = setInterval(() => {
      if (window.closed !== false) {
        clearInterval(this._pollTimer);
        this.loginWindowExitHandler();
      }
    }, 200);
  }

  private loadStartHandler(e: any, parameter: any): void {
    const url = e.url;

    if (url.indexOf(parameter + '=') > 0 || url.indexOf('error=') > 0) {
      // When we get the access token fast, the login window (inappbrowser) is still opening with animation
      // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
      const timeout = 600 - (new Date().getTime() - this._startTime);

      const fv = () => {
        if (this._loginWindow) {
          if (this._loginWindow.removeEventListener) {
            this._loginWindow.removeEventListener('loadstart', this.loadStartHandler);
            this._loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
          }

          this._loginWindow.close();
        }

        this._loginWindow = null;
      };

      setTimeout(fv, timeout > 0 ? timeout : 0);
      this._deferred.resolve(url);
    }
  }

  private loginWindowExitHandler(): void {
    // Handle the situation where the user closes the login window manually before completing the login process
    if (this._loginWindow) {
      if (this._loginWindow.removeEventListener) {
        this._loginWindow.removeEventListener('loadstart', this.loadStartHandler);
        this._loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
      }

      this._loginWindow = null;
    }

    const err = new LoginError('User cancelled');
    err.code = LoginErrorCodes.USER_CANCELLED;

    this._deferred.reject(err);
  }
}
