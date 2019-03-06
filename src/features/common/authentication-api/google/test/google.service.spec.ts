import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { take } from 'rxjs/operators';

import { OauthWindowService } from '../../oauth-window';
import { WindowModule, WindowService } from '../../window';
import { GoogleService } from '../google.service';
import { Reducer as authReducer } from '../../store';
import { defaultAuthenticationApiConfig, AuthenticationApiModule, GoogleConfig, AUTH_CONFIG_TOKEN } from '../../lib';
import { ApiModule } from '../../api';
import { OauthWindowMockService } from '../../oauth-window/test/oauth-window.service.mock';
import { LocalStorage } from '../../storage/local-storage.service';

describe('Google', () => {
  const apiUrl = 'http://api';
  const webserverUrl = 'http://webserver';

  let httpTestingController: HttpTestingController;

  const googleConfig: GoogleConfig = {
    appId: 'testapp',
    permissions: 'email'
  };

  const config = { ...defaultAuthenticationApiConfig };

  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;
  config.google = googleConfig;

  const successUrl = `${webserverUrl}#access_token=access_token`;
  const errorUrl = `${webserverUrl}?error=invalid_token'`;
  let currentRedirectUrl = successUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        EffectsModule.forRoot([]),
        WindowModule,
        AuthenticationApiModule.forRoot(config),
        ApiModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: OauthWindowService,
          useClass: OauthWindowMockService
        },
        GoogleService,
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

    oauthWindow.callback = url => {
      const windowService: WindowService = TestBed.get(WindowService);

      windowService.nativeWindow.googleOauthCallback(currentRedirectUrl);
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
    const google: GoogleService = TestBed.get(GoogleService);

    google
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

    const req = httpTestingController.expectOne(`${apiUrl}/auth/google/token`);

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
    const google: GoogleService = TestBed.get(GoogleService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    oauthWindow.changeUrl$.pipe(take(1)).subscribe(url => {
      if (url) {
        oauthWindow.subject.next(currentRedirectUrl);
      }
    });

    google
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

    const req = httpTestingController.expectOne(`${apiUrl}/auth/google/token`);

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
    const google: GoogleService = TestBed.get(GoogleService);

    currentRedirectUrl = errorUrl;

    google
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
    const google: GoogleService = TestBed.get(GoogleService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    currentRedirectUrl = `${webserverUrl}/google/success.html`;

    google
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
    const google: GoogleService = TestBed.get(GoogleService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    config.google.permissions = '';
    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    oauthWindow.changeUrl$.pipe(take(1)).subscribe(url => {
      expect(url.indexOf('scope')).toEqual(-1);
      config.google.permissions = 'email';
      done();
    });

    google
      .connect()
      .pipe(take(1))
      .subscribe(
        () => {},
        err => {
          config.google.permissions = 'email';
          done(err);
        }
      );
  });
});
