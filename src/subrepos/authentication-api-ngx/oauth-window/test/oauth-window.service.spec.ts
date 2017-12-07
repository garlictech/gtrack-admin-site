import { OauthWindowService } from '../oauth-window.service';
import { Subject } from 'rxjs/Subject';

import { Emitter } from '../../emitter';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/elementAt';
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { Observable } from 'rxjs/Observable';

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
    let matches = script.code.match(/window.location.href='([^']*)'/);

    if (matches.length === 2) {
      let url = matches[1];

      this.location.href = url;
    }
  }
}

describe('OauthWindow', () => {
  let mockWindow;
  let mockWindowCordova;
  let windows: Subject<MockWindow>;

  beforeEach(() => {
    windows = new Subject<MockWindow>();

    mockWindow = {
      open: url => {
        let win: MockWindow = new MockWindow();
        win.location.href = url;
        windows.next(win);

        return win;
      }
    };

    mockWindowCordova = {
      open: url => {
        let win: MockWindow = new MockWindowCordova();
        win.location.href = url;
        windows.next(win);

        return win;
      }
    };
  });

  it('should open a new window', done => {
    let windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    let url = 'http://test.com';

    windows.take(1).subscribe((win: MockWindow) => {
      expect(win.location.href).toEqual(url);
      done();
    });

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);
    oauthWindow.open(url).catch(err => done.fail(err));
  });

  it('should close previous window', done => {
    let windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    let url = 'http://test.com';
    let firstWindow: MockWindow;
    let secondWindow: MockWindow;

    windows.elementAt(0).subscribe((win: MockWindow) => {
      firstWindow = win;
    });

    windows.elementAt(1).subscribe((win: MockWindow) => {
      secondWindow = win;
    });

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow.open(url).catch((err: Error) => {
      expect(err.message).toEqual('OAuth window reopened');
      expect(firstWindow.closed).toBe(true);
      expect(secondWindow.closed).toBe(false);

      done();
    });

    oauthWindow.open(url).catch((err: Error) => done.fail(err));
  });

  it('should change URL of opened window', done => {
    let windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };
    let oauthWindow = new OauthWindowService(windowService);

    let url = 'http://test.com';
    let url2 = 'http://test2.com';
    let activeWindow: MockWindow;

    windows.take(1).subscribe((win: MockWindow) => {
      expect(win.location.href).toEqual(url);
      activeWindow = win;

      done();
    });

    // wait for OauthWindow to have the window istance
    Observable
      .interval(200)
      .map(() => oauthWindow.isOpened())
      .filter(opened => (opened === true))
      .take(1)
      .subscribe(() => {
        oauthWindow.changeUrl(url2);
        expect(activeWindow.location.href).toEqual(url2);
      });

    oauthWindow.open(url).catch(err => done.fail(err));
  });

  it('should not fail when there is not any opened window', () => {
    let windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow.changeUrl('http://test.com');
    oauthWindow.close();
  });

  it("should get URL from cordova's loadStartHandler event", done => {
    let windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    let url = 'http://test.com';

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .then(responseUrl => {
        expect(responseUrl).toEqual('http://test.com?access_token=5');
        done();
      })
      .catch(err => done.fail(err));

    oauthWindow.changeUrl('http://test.com?access_token=5');
  });

  it("should get URL from cordova's loadStartHandler event when error happened", done => {
    let windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    let url = 'http://test.com';

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .then(responseUrl => {
        expect(responseUrl).toEqual('http://test.com?error=error');
        done();
      })
      .catch(err => done.fail(err));

    oauthWindow.changeUrl('http://test.com?error=error');
  });

  it("should not get URL from cordova's loadStartHandler when URL doesn't contain the parameter or exit", done => {
    let windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    windows.elementAt(0).subscribe((win: MockWindow) => {
      win.on('loadstart', () => {
        setTimeout(() => done(), 400);
      });
    });

    let url = 'http://test.com';

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url, 'access_token')
      .then(responseUrl => {
        done.fail(new Error('URL returned'));
      })
      .catch(err => done.fail(err));

    oauthWindow.changeUrl('http://test2.com');
  });

  it('should removeEventListeners on exit', done => {
    let windowService = {
      get nativeWindow() {
        return mockWindowCordova;
      }
    };

    let cordovaWindow: MockWindowCordova;

    let url = 'http://test.com';

    windows.take(1).subscribe((win: MockWindowCordova) => {
      expect(win.location.href).toEqual(url);
      cordovaWindow = win;

      cordovaWindow.close();
    });

    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    oauthWindow
      .open(url)
      .then(() => {
        done.fail(new Error('Not failed'));
      })
      .catch((err: Error) => {
        expect(err.message).toBe('User cancelled');
        done();
      });
  });

  it('shoud close the window', done => {
    let windowService = {
      get nativeWindow() {
        return mockWindow;
      }
    };

    let url = 'http://test.com';
    let oauthWindow: OauthWindowService = new OauthWindowService(windowService);

    windows.take(1).subscribe((win: MockWindow) => {
      expect(win.location.href).toEqual(url);

      win.on('exit', () => {
        done();
      });

      // wait for OauthWindow to have the window istance
      Observable
        .interval(200)
        .map(() => oauthWindow.isOpened())
        .filter(opened => (opened === true))
        .take(1)
        .subscribe(() => oauthWindow.close());
    });

    oauthWindow.open(url).catch((err: Error) => {
      if (err.message !== 'User cancelled') {
        done.fail(err);
      }
    });
  });
});
