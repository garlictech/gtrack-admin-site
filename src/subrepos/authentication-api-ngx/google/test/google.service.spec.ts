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
import { GoogleService } from '../google.service';
import { Reducer as authReducer } from '../../store';
import { defaultAuthenticationApiConfig, AuthenticationApiModule, IGoogleConfig, AUTH_CONFIG_TOKEN } from '../../lib';
import { ApiModule } from '../../api';
import { OauthWindowMockService } from '../../oauth-window/test/oauth-window.service.mock';
import { LocalStorage } from '../../storage/local-storage.service';

import 'rxjs/add/operator/elementAt';
import 'rxjs/add/operator/take';

describe('Google', () => {
  let apiUrl = 'http://api';
  let webserverUrl = 'http://webserver';

  let googleConfig: IGoogleConfig = {
    appId: 'testapp',
    permissions: 'email'
  };

  let config = { ...defaultAuthenticationApiConfig };

  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;
  config.google = googleConfig;

  let successUrl = `${webserverUrl}#access_token=access_token`;
  let errorUrl = `${webserverUrl}?error=invalid_token'`;
  let currentRedirectUrl = successUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        EffectsModule.forRoot([]),
        WindowModule,
        AuthenticationApiModule.forRoot(config),
        ApiModule
      ],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: OauthWindowService,
          useClass: OauthWindowMockService
        },
        GoogleService,
        {
          provide: AUTH_CONFIG_TOKEN,
          useFactory: () => config
        },
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ],
      declarations: []
    });

    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);
    let storage: LocalStorage = TestBed.get(LocalStorage);

    storage.clear();

    oauthWindow.callback = url => {
      let windowService: WindowService = TestBed.get(WindowService);

      windowService.nativeWindow.googleOauthCallback(currentRedirectUrl);
    };
  });

  afterEach(() => {
    let storage: LocalStorage = TestBed.get(LocalStorage);
    currentRedirectUrl = successUrl;
    storage.clear();
  });

  it('should login', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let google: GoogleService = TestBed.get(GoogleService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      let body = connection.request.json();

      expect(body.access_token).toEqual('access_token');
      expect(connection.request.url).toEqual(`${apiUrl}/auth/google/token`);
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

    connections.elementAt(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/user/me`);
      expect(connection.request.method).toEqual(RequestMethod.Get);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              id: '1',
              email: 'test@test.com'
            }
          })
        )
      );
    });

    google
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
    let google: GoogleService = TestBed.get(GoogleService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    connections.elementAt(0).subscribe((connection: MockConnection) => {
      let body = connection.request.json();

      expect(body.access_token).toEqual('access_token');
      expect(connection.request.url).toEqual(`${apiUrl}/auth/google/token`);
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

    connections.elementAt(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${apiUrl}/user/me`);
      expect(connection.request.method).toEqual(RequestMethod.Get);

      connection.mockRespond(
        new Response(
          new ResponseOptions({
            body: {
              id: '1',
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

    google
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

  it('should reject the promise on error url', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let google: GoogleService = TestBed.get(GoogleService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    currentRedirectUrl = errorUrl;

    google.connect().catch(err => {
      expect(err.error).toEqual('Not authorized');
      done();
    });
  });

  it('should reject the promise without access_token', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let google: GoogleService = TestBed.get(GoogleService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    let connections: Subject<MockConnection> = backend.connections;

    currentRedirectUrl = `${webserverUrl}/google/success.html`;

    google.connect().catch(err => {
      expect(err.error).toEqual('Not authorized');
      done();
    });
  });

  it('should work without permissions', done => {
    let google: GoogleService = TestBed.get(GoogleService);
    let oauthWindow: OauthWindowMockService = TestBed.get(OauthWindowService);

    config.google.permissions = '';
    oauthWindow.callback = url => {
      /* EMPTY ON PURPOSE */
    };

    oauthWindow.on('changeurl', url => {
      expect(url.indexOf('scope')).toEqual(-1);
      config.google.permissions = 'email';
      done();
    });

    google.connect().catch(err => {
      config.google.permissions = 'email';
      done.fail(err);
    });
  });
});
