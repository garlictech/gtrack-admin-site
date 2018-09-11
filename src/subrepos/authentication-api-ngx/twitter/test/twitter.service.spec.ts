import { Http } from '@angular/http';
import { Component, Injector } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions, XHRBackend, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs/Subject';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { OauthWindowService } from '../../oauth-window';
import { WindowModule, WindowService } from '../../window';
import { TwitterService } from '../twitter.service';
import { AuthService } from '../../auth';
import { Reducer as authReducer } from '../../store';
import { AUTH_CONFIG_TOKEN, defaultAuthenticationApiConfig, AuthenticationApiModule } from '../../lib';
import { ApiModule } from '../../api';
import { OauthWindowMockService } from '../../oauth-window/test/oauth-window.service.mock';
import { LocalStorage } from '../../storage/local-storage.service';

import 'rxjs/add/operator/elementAt';
import 'rxjs/add/operator/take';

describe('TwitterService', () => {
  let apiUrl = 'http://api';
  let webserverUrl = 'http://webserver';

  let config = { ...defaultAuthenticationApiConfig };
  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;
  config.twitter = true;

  let redirectUrl = `${config.webserverUrl}/twitter/success.html`;

  let successUrl: string = redirectUrl + '?oauth_token=token&oauth_token_secret=secret';
  let errorUrl: string = redirectUrl + '?error=invalid_token';
  let currentRedirectUrl: string = successUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(authReducer), EffectsModule.forRoot([]), WindowModule, ApiModule],
      providers: [
        BaseRequestOptions,
        MockBackend,
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
        TwitterService,
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });

    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);
    let storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();

    oauthWindow.callback = url => {
      let windowService: WindowService = TestBed.get(WindowService);

      windowService.nativeWindow.twitterOauthCallback(currentRedirectUrl);
    };
  });

  afterEach(() => {
    let storage: LocalStorage = TestBed.get(LocalStorage);
    currentRedirectUrl = successUrl;
    storage.clear();
  });

  it('should login', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let twitter: TwitterService = TestBed.get(TwitterService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toBe(`${apiUrl}/auth/twitter/oauth/request_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token&oauth_token_secret=secret'
          })
        )
      );
    });

    connections.elementAt(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toBe(`${apiUrl}/auth/twitter/oauth/access_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token2&oauth_token_secret=secret2'
          })
        )
      );
    });

    connections.elementAt(2).subscribe((connection: MockConnection) => {
      let body = connection.request.json();

      expect(body.oauth_token).toEqual('token2');
      expect(body.oauth_token_secret).toEqual('secret2');
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              token: 'token'
            }
          })
        )
      );
    });

    connections.elementAt(3).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/user/me`);
      expect(connection.request.method).toEqual(RequestMethod.Get);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              id: '1',
              provider: 'twitter',
              email: 'test@test.com'
            }
          })
        )
      );
    });

    twitter
      .connect()
      .then(auth => {
        let user = auth.user;

        expect(user).not.toBeNull();

        if (user !== null) {
          expect(user.id).toEqual('1');
          expect(user.email).toEqual('test@test.com');
        }

        done();
      })
      .catch(err => done.fail(err));
  });

  it('should login with cordova', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let twitter: TwitterService = TestBed.get(TwitterService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toBe(`${apiUrl}/auth/twitter/oauth/request_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token&oauth_token_secret=secret'
          })
        )
      );
    });

    connections.elementAt(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/oauth/access_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token2&oauth_token_secret=secret2'
          })
        )
      );
    });

    connections.elementAt(2).subscribe((connection: MockConnection) => {
      let body = connection.request.json();

      expect(body.oauth_token).toEqual('token2');
      expect(body.oauth_token_secret).toEqual('secret2');
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              token: 'token'
            }
          })
        )
      );
    });

    connections.elementAt(3).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/user/me`);
      expect(connection.request.method).toEqual(RequestMethod.Get);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              id: '1',
              provider: 'twitter',
              email: 'test@test.com'
            }
          })
        )
      );
    });

    oauthWindow.on('changeurl', url => {
      if (url) {
        oauthWindow.deferred.resolve(currentRedirectUrl);
      }
    });

    twitter
      .connect()
      .then(auth => {
        let user = auth.user;

        expect(user).not.toBeNull();

        if (user !== null) {
          expect(user.id).toEqual('1');
          expect(user.email).toEqual('test@test.com');
        }

        done();
      })
      .catch(err => done.fail(err));
  });

  it('should reject login without oauth_token response', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let twitter: TwitterService = TestBed.get(TwitterService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    let spy: jasmine.Spy = spyOn(oauthWindow, 'close');

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/oauth/request_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'error'
          })
        )
      );
    });

    twitter
      .connect()
      .then(user => {
        done.fail(new Error('Not failed'));
      })
      .catch((err: Error) => {
        expect(spy.calls.count()).toEqual(1);
        expect(err.message).toEqual('Oauth request token was not received');
        done();
      });
  });

  it('should reject the promise on error url', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let twitter: TwitterService = TestBed.get(TwitterService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    currentRedirectUrl = errorUrl;

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/oauth/request_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token&oauth_token_secret=secret'
          })
        )
      );
    });

    twitter.connect().catch(err => {
      expect(err.error).toEqual('Not authorized');
      done();
    });
  });

  it('should reject the promise on invalid url', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let twitter: TwitterService = TestBed.get(TwitterService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    currentRedirectUrl = redirectUrl;

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/auth/twitter/oauth/request_token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: 'oauth_token=token&oauth_token_secret=secret'
          })
        )
      );
    });

    twitter.connect().catch(err => {
      expect(err.error).toEqual('Not authorized');
      done();
    });
  });
});
