import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { take } from 'rxjs/operators';

import { OauthWindowService } from '../../oauth-window';
import { FacebookService } from '../facebook.service';
import { Reducer as authReducer } from '../../store';
import { defaultAuthenticationApiConfig, AuthenticationApiModule, FacebookConfig, AUTH_CONFIG_TOKEN } from '../../lib';
import { ApiModule } from '../../api';
import { OauthWindowMockService } from '../../oauth-window/test/oauth-window.service.mock';
import { LocalStorage } from '../../storage/local-storage.service';

import { WindowModule, WindowService } from '../../window';

import 'rxjs/add/operator/elementAt';
import 'rxjs/add/operator/take';

describe('Facebook', () => {
  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/web';

  let httpTestingController: HttpTestingController;

  const facebookConfig: FacebookConfig = {
    appId: 'testapp',
    version: '2.8',
    permissions: 'profile'
  };

  const config = { ...defaultAuthenticationApiConfig };
  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;

  config.facebook = facebookConfig;

  const successUrl = `${webserverUrl}#access_token=access_token`;
  const errorUrl = `${webserverUrl}?error=invalid_token'`;
  let currentRedirectUrl = successUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot(authReducer),
        EffectsModule.forRoot([]),
        AuthenticationApiModule.forRoot(config),
        ApiModule,
        WindowModule
      ],
      providers: [
        {
          provide: OauthWindowService,
          useClass: OauthWindowMockService
        },
        FacebookService,
        {
          provide: AUTH_CONFIG_TOKEN,
          useFactory: () => config
        }
      ],
      declarations: []
    });

    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);
    const storage: LocalStorage = TestBed.get(LocalStorage);

    storage.clear();

    const facebook: FacebookService = TestBed.get(FacebookService);

    oauthWindow.callback = url => {
      const windowService: WindowService = TestBed.get(WindowService);

      windowService.nativeWindow.facebookOauthCallback(currentRedirectUrl);
    };

    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    const storage: LocalStorage = TestBed.get(LocalStorage);
    currentRedirectUrl = successUrl;
    storage.clear();

    httpTestingController.verify();
  });

  it('should login', done => {
    const facebook: FacebookService = TestBed.get(FacebookService);

    facebook
      .connect()
      .pipe(take(1))
      .subscribe(auth => {
        const user = auth.user;

        expect(user).not.toBeNull();

        if (user !== null) {
          expect(user.id).toEqual('1');
          expect(user.email).toEqual('test@test.com');
        }

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/auth/facebook/token`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body.access_token).toEqual('access_token');

    req.flush({
      token: 'token'
    });

    const req2 = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req2.request.method).toEqual('GET');

    req2.flush({
      id: '1',
      email: 'test@test.com'
    });
  });

  it('should login with cordova', done => {
    const facebook: FacebookService = TestBed.get(FacebookService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    oauthWindow.changeUrl$.pipe(take(1)).subscribe(url => {
      if (url) {
        oauthWindow.subject.next(currentRedirectUrl);
      }
    });

    facebook
      .connect()
      .pipe(take(1))
      .subscribe(auth => {
        const user = auth.user;

        expect(user).not.toBeNull();

        if (user !== null) {
          expect(user.id).toEqual('1');
          expect(user.email).toEqual('test@test.com');
        }

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/auth/facebook/token`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body.access_token).toEqual('access_token');

    req.flush({
      token: 'token'
    });

    const req2 = httpTestingController.expectOne(`${apiUrl}/user/me`);

    expect(req2.request.method).toEqual('GET');

    req2.flush({
      id: '1',
      email: 'test@test.com'
    });
  });

  it('should reject the promise on error url', done => {
    const facebook: FacebookService = TestBed.get(FacebookService);

    currentRedirectUrl = errorUrl;

    facebook
      .connect()
      .pipe(take(1))
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        err => {
          expect(err.error).toEqual('Not authorized');
          done();
        }
      );
  });

  it('should reject the promise without access_token', done => {
    const facebook: FacebookService = TestBed.get(FacebookService);

    currentRedirectUrl = `${webserverUrl}/facebook/success.html`;

    facebook
      .connect()
      .pipe(take(1))
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        err => {
          expect(err.error).toEqual('Not authorized');
          done();
        }
      );
  });

  it('should work without permissions', done => {
    const facebook: FacebookService = TestBed.get(FacebookService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    config.facebook.permissions = '';
    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    oauthWindow.changeUrl$.pipe(take(1)).subscribe(url => {
      expect(url.indexOf('scope')).toEqual(-1);
      config.facebook.permissions = 'profile';
      done();
    });

    facebook
      .connect()
      .pipe(take(1))
      .subscribe(
        () => {},
        err => {
          config.facebook.permissions = 'profile';
          done(err);
        }
      );
  });
});
