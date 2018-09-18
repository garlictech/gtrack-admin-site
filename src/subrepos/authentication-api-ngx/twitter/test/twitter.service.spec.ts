import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { take, filter } from 'rxjs/operators';

import { OauthWindowService } from '../../oauth-window';
import { WindowModule, WindowService } from '../../window';
import { TwitterService } from '../twitter.service';
import { AuthService } from '../../auth';
import { Reducer as authReducer } from '../../store';
import { AUTH_CONFIG_TOKEN, defaultAuthenticationApiConfig } from '../../lib';
import { ApiModule } from '../../api';
import { OauthWindowMockService } from '../../oauth-window/test/oauth-window.service.mock';
import { LocalStorage } from '../../storage/local-storage.service';

describe('TwitterService', () => {
  const apiUrl = 'http://api';
  const webserverUrl = 'http://webserver';

  let httpTestingController: HttpTestingController;

  const config = { ...defaultAuthenticationApiConfig };
  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;
  config.twitter = true;

  const redirectUrl = `${config.webserverUrl}/twitter/success.html`;

  const successUrl: string = redirectUrl + '?oauth_token=token&oauth_token_secret=secret';
  const errorUrl: string = redirectUrl + '?error=invalid_token';
  let currentRedirectUrl: string = successUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        EffectsModule.forRoot([]),
        WindowModule,
        ApiModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        LocalStorage,
        {
          provide: AUTH_CONFIG_TOKEN,
          useValue: config
        },
        {
          provide: OauthWindowService,
          useClass: OauthWindowMockService
        },
        TwitterService
      ]
    });

    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);
    const storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();

    oauthWindow.callback = url => {
      const windowService: WindowService = TestBed.get(WindowService);

      windowService.nativeWindow.twitterOauthCallback(currentRedirectUrl);
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
    const twitter: TwitterService = TestBed.get(TwitterService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    twitter
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

    const req = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/request_token`);
    expect(req.request.method).toEqual('POST');
    req.flush('oauth_token=token&oauth_token_secret=secret');

    const req2 = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/access_token`);
    expect(req2.request.method).toEqual('POST');
    req2.flush('oauth_token=token2&oauth_token_secret=secret2');

    const req3 = httpTestingController.expectOne(`${apiUrl}/auth/twitter/token`);
    expect(req3.request.method).toEqual('POST');
    expect(req3.request.body.oauth_token).toEqual('token2');
    expect(req3.request.body.oauth_token_secret).toEqual('secret2');

    req3.flush({
      token: 'token'
    });

    const req4 = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req4.request.method).toEqual('GET');

    req4.flush({
      id: '1',
      provider: 'twitter',
      email: 'test@test.com'
    });
  });

  it('should login with cordova', done => {
    const twitter: TwitterService = TestBed.get(TwitterService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

<<<<<<< HEAD
    oauthWindow.changeUrl$
=======
    oauthWindow
      .changeUrl$
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
      .pipe(
        filter(url => !!url),
        take(1)
      )
      .subscribe(url => {
        oauthWindow.subject.next(currentRedirectUrl);
      });

    twitter
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

    const req = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/request_token`);
    expect(req.request.method).toEqual('POST');
    req.flush('oauth_token=token&oauth_token_secret=secret');

    const req2 = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/access_token`);
    expect(req2.request.method).toEqual('POST');
    req2.flush('oauth_token=token2&oauth_token_secret=secret2');

    const req3 = httpTestingController.expectOne(`${apiUrl}/auth/twitter/token`);
    expect(req3.request.method).toEqual('POST');
    expect(req3.request.body.oauth_token).toEqual('token2');
    expect(req3.request.body.oauth_token_secret).toEqual('secret2');

    req3.flush({
      token: 'token'
    });

    const req4 = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req4.request.method).toEqual('GET');

    req4.flush({
      id: '1',
      provider: 'twitter',
      email: 'test@test.com'
    });
  });

  it('should reject login without oauth_token response', done => {
    const twitter: TwitterService = TestBed.get(TwitterService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    const spy: jasmine.Spy = spyOn(oauthWindow, 'close');

    twitter
      .connect()
      .pipe(take(1))
<<<<<<< HEAD
      .subscribe(
        user => {
          done(new Error('Not failed'));
        },
        (err: Error) => {
          expect(spy.calls.count()).toEqual(1);
          expect(err.message).toEqual('Oauth request token was not received');
          done();
        }
      );
=======
      .subscribe(user => {
        done(new Error('Not failed'));
      }, (err: Error) => {
        expect(spy.calls.count()).toEqual(1);
        expect(err.message).toEqual('Oauth request token was not received');
        done();
      });
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

    const req = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/request_token`);
    expect(req.request.method).toEqual('POST');
    req.flush('error');
  });

  it('should reject the promise on error url', done => {
    const twitter: TwitterService = TestBed.get(TwitterService);

    currentRedirectUrl = errorUrl;

    twitter
      .connect()
      .pipe(take(1))
<<<<<<< HEAD
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        err => {
          expect(err.error).toEqual('Not authorized');
          done();
        }
      );
=======
      .subscribe(() => {
        done(new Error('Not failed'));
      }, err => {
        expect(err.error).toEqual('Not authorized');
        done();
      });
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

    const req = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/request_token`);
    expect(req.request.method).toEqual('POST');
    req.flush('oauth_token=token&oauth_token_secret=secret');
  });

  it('should throw error on invalid url', done => {
    const twitter: TwitterService = TestBed.get(TwitterService);
    const oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    currentRedirectUrl = redirectUrl;

    twitter
      .connect()
      .pipe(take(1))
<<<<<<< HEAD
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        err => {
          expect(err.error).toEqual('Not authorized');
          done();
        }
      );
=======
      .subscribe(() => {
        done(new Error('Not failed'));
      }, err => {
        expect(err.error).toEqual('Not authorized');
        done();
      });
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

    const req = httpTestingController.expectOne(`${apiUrl}/auth/twitter/oauth/request_token`);
    expect(req.request.method).toEqual('POST');
    req.flush('oauth_token=token&oauth_token_secret=secret');
  });
});
