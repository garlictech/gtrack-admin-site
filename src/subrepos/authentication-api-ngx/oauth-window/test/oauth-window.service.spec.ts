import { OauthWindowService } from '../oauth-window.service';
import { Emitter } from '../../emitter';

import {
  take,
  elementAt,
  map,
  filter,
  catchError,
  switchMap
} from 'rxjs/operators';

import { ReplaySubject } from 'rxjs';

import { interval, combineLatest } from 'rxjs';

class WindowLocation extends Emitter {
  private _href = '';
  public get href(): string {
    return this._href;
  }

  public set href(url: string) {
    this._href = url;
    this.emit('change', url);
  }
}

class MockWindow extends Emitter {
  public closed = false;

  public location: WindowLocation;

  public focus() {
    /* EMPTY ON PURPOSE */
  }

  public constructor() {
    super();
    this.location = new WindowLocation();
  }

  public addEventListener(name: string, handler: ((value: any) => void)) {
    this.on(name, handler);
  }

  public removeEventListener(name: string) {
    this.off(name);
  }

  public close() {
    this.closed = true;
    this.emit('exit');
  }
}

class MockWindowCordova extends MockWindow {
  public constructor() {
    super();

    this.location.on('change', url => {
      this.emit('loadstart', {
        url: url
      });
    });
  }

  public executeScript(script) {
    const matches = script.code.match(/window.location.href='([^']*)'/);

    if (matches.length === 2) {
      const url = matches[1];

      this.location.href = url;
    }
  }
}

describe('OauthWindow', () => {
  let mockWindow;
  let mockWindowCordova;
  let windows$: ReplaySubject<MockWindow>;

  beforeEach(() => {
    windows$ = new ReplaySubject<MockWindow>();

    mockWindow = {
      open: url => {
        const win: MockWindow = new MockWindow();
        win.location.href = url;
        windows$.next(win);

        return win;
      }
    };

    mockWindowCordova = {
      open: url => {
        const win: MockWindow = new MockWindowCordova();
        win.location.href = url;
        windows$.next(win);

        return win;
      }
    };
  });

  afterEach(() => {
    windows$.complete();
  });

  it('should open a new window', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    const url = 'http://test.com';

    windows$
      .pipe(take(1))
      .subscribe((win: MockWindow) => {
        expect(win.location.href).toEqual(url);
        done();
      });

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);
    oauthWindow
      .open(url)
      .pipe(
        catchError(err => done(err))
      );
  });

  it('should close previous window', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    const url = 'http://test.com';
    let firstWindow: MockWindow;
    let secondWindow: MockWindow;

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url)
      .subscribe(() => {
        done(new Error('Not failed'));
      }, err => {
        expect(err.message).toEqual('OAuth window reopened');

        combineLatest(
          windows$.pipe(elementAt(0)),
          windows$.pipe(elementAt(1))
        )
        .pipe(take(1))
        .subscribe(windows => {
          expect(windows[0].closed).toBe(true);
          expect(windows[1].closed).toBe(false);

          done();
        });
      });

      oauthWindow.open(url).subscribe();
  });

  it('should change URL of opened window', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };
    const oauthWindow = new OauthWindowService(windowService);

    const url = 'http://test.com';
    const url2 = 'http://test2.com';
    let activeWindow: MockWindow;

    // wait for OauthWindow to have the window istance
    interval(200)
      .pipe(
        map(() => oauthWindow.isOpened()),
        filter(opened => opened === true),
        take(1),
        switchMap(() => windows$.pipe(take(1)))
      )
      .subscribe(win => {
        expect(win.location.href).toEqual(url);
        activeWindow = win;

        oauthWindow.changeUrl(url2);
        expect(activeWindow.location.href).toEqual(url2);

        done();
      });

    oauthWindow.open(url).subscribe(() => {}, done);
  });

  it('should not fail when there is not any opened window', () => {
    const windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow.changeUrl('http://test.com');
    oauthWindow.close();
  });

  it('should get URL from cordova\'s loadStartHandler event', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    const url = 'http://test.com';

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .pipe(take(1))
      .subscribe(responseUrl => {
        expect(responseUrl).toEqual('http://test.com?access_token=5');
        done();
      }, done);

    oauthWindow.changeUrl('http://test.com?access_token=5');
  });

  it('should get URL from cordova\'s loadStartHandler event when error happened', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    const url = 'http://test.com';

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .subscribe(responseUrl => {
        expect(responseUrl).toEqual('http://test.com?error=error');
        done();
      }, done);

    oauthWindow.changeUrl('http://test.com?error=error');
  });

  it('should not get URL from cordova\'s loadStartHandler when URL doesn\'t contain the parameter or exit', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    windows$
      .pipe(elementAt(0))
      .subscribe((win: MockWindow) => {
        win.on('loadstart', () => {
          setTimeout(() => done(), 400);
        });
      });

    const url = 'http://test.com';

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .subscribe(responseUrl => {
        done(new Error('URL returned'));
      }, done);

    oauthWindow.changeUrl('http://test2.com');
  });

  it('should removeEventListeners on exit', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    let cordovaWindow: MockWindowCordova;

    const url = 'http://test.com';

    windows$
      .pipe(take(1))
      .subscribe((win: MockWindowCordova) => {
        expect(win.location.href).toEqual(url);
        cordovaWindow = win;

        cordovaWindow.close();
      });

    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url)
      .subscribe(() => {
        done(new Error('Not failed'));
      }, (err: Error) => {
        expect(err.message).toBe('User cancelled');
        done();
      });
  });

  it('shoud close the window', done => {
    const windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    const url = 'http://test.com';
    const oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    windows$
      .pipe(take(1))
      .subscribe((win: MockWindow) => {
        expect(win.location.href).toEqual(url);

        win.on('exit', () => {
          done();
        });

        // wait for OauthWindow to have the window istance
        interval(200)
          .pipe(
            map(() => oauthWindow.isOpened()),
            filter(opened => opened === true),
            take(1)
          )
          .subscribe(() => oauthWindow.close());
      });

    oauthWindow
      .open(url)
      .pipe(take(1))
      .subscribe(() => {
      }, err => {
        if (err.message !== 'User cancelled') {
          done.fail(err);
        }
      });
  });
});
