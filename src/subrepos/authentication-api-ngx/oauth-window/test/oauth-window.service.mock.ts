import { Injectable, Injector } from '@angular/core';
import { WindowService } from '../../window';
import { Deferred } from '../../deferred';
import { Emitter } from '../../emitter';

@Injectable()
export class OauthWindowMockService extends Emitter {
  public deferred: Deferred;

  constructor(private windowService: WindowService) {
    super();
    this.deferred = new Deferred();
  }

  public callback = (url: string) => {
    /* EMPTY ON PURPOSE */
  };

  public open(loginUrl: string, parameter = 'access_token'): Promise<any> {
    this.changeUrl(loginUrl);
    return this.deferred.promise;
  }

  public close(): void {
    // Do nothing
  }

  public changeUrl(url: string): void {
    this.emit('changeurl', url);

    if (url) {
      this.callback(url);
    }
  }
}
