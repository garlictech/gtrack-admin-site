import { Injectable, Inject } from '@angular/core';
import { Deferred } from '../deferred';
import { WindowService } from '../window';

@Injectable()
export class OauthWindowService {
  private deferred: Deferred = new Deferred();
  private startTime: number;
  private loginWindow: any;
  private window: any;

  constructor(private windowService: WindowService) {
    this.window = this.windowService.nativeWindow;
  }

  /**
   * Open new login pop-up
   */
  public open(loginUrl: string, parameter = 'access_token'): Promise<any> {
    this.startTime = new Date().getTime();

    if (this.loginWindow && this.loginWindow.closed !== true) {
      this.loginWindow.removeEventListener('loadstart', this.loadStartHandler);
      this.loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
      this.loginWindow.close();
      this.loginWindow = null;

      this.deferred.reject(new Error('Cancelled'));
    }

    this.deferred = new Deferred();

    this.loginWindow = this.window.open(loginUrl, '_blank', 'location=no');

    this.loginWindow.addEventListener('loadstart', (e: any) => {
      this.loadStartHandler(e, parameter);
    });

    this.loginWindow.addEventListener('exit', () => {
      this.loginWindowExitHandler();
    });

    return this.deferred.promise;
  }

  /**
   * Change window URL
   */
  public changeUrl(url: string): void {
    if (this.loginWindow) {
      if (typeof this.loginWindow.executeScript === 'function') {
        this.loginWindow.executeScript({
          code: "window.location.href='" + url + "';"
        });
      } else {
        this.loginWindow.location.href = url;
        this.loginWindow.focus();
      }
    }
  }

  public close(): void {
    if (this.loginWindow) {
      this.loginWindow.close();
    }
  }

  private loadStartHandler(e: any, parameter: any): void {
    let url = e.url;

    if (url.indexOf(parameter + '=') > 0 || url.indexOf('error=') > 0) {
      // When we get the access token fast, the login window (inappbrowser) is still opening with animation
      // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
      let timeout = 600 - (new Date().getTime() - this.startTime);

      let fv = () => {
        this.loginWindow.removeEventListener('loadstart', this.loadStartHandler);
        this.loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
        this.loginWindow.close();
        this.loginWindow = null;
      };

      setTimeout(fv, timeout > 0 ? timeout : 0);
      this.deferred.resolve(url);
    }
  }

  private loginWindowExitHandler(): void {
    // Handle the situation where the user closes the login window manually before completing the login process
    this.loginWindow.removeEventListener('loadstart', this.loadStartHandler);
    this.loginWindow.removeEventListener('exit', this.loginWindowExitHandler);
    this.loginWindow = null;

    this.deferred.reject(new Error('User cancelled'));
  }
}
