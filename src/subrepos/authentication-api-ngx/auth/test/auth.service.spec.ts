import { Http } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions, XHRBackend, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ApiModule } from '../../api';
import { ApiService } from '../../api/api.service';
import { AuthService } from '../auth.service';
import { defaultAuthenticationApiConfig, AUTH_CONFIG_TOKEN, AuthenticationApiModule } from '../../lib';
import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { Reducer as authReducer, domain } from '../../store';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/toPromise';
import { Effect } from '@ngrx/effects/src/effects_metadata';

class MockError extends Response implements Error {
  public name: string;
  public message: string;
}

describe('AuthService', () => {
  let reducer = {};

  let user = {
    id: '1',
    email: 'test@test.com',
    provider: 'facebook'
  };

  let apiUrl = 'http://localhost/api';
  let webserverUrl = 'http://localhost/web';

  let authConfig = { ...defaultAuthenticationApiConfig };

  authConfig.apiUrl = apiUrl;
  authConfig.webserverUrl = webserverUrl;

  let firebaseLoginSpy: jasmine.Spy;
  let firebaseLogoutSpy: jasmine.Spy;

  reducer[domain] = authReducer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducer),
        EffectsModule.forRoot([]),
        AuthenticationApiModule.forRoot(authConfig),
        ApiModule
      ],
      providers: [
        AuthService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: AUTH_CONFIG_TOKEN,
          useValue: authConfig
        },
        {
          provide: LocalStorage,
          useClass: MockStorageService
        },
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (_backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(_backend, defaultOptions);
          }
        }
      ]
    });

    let backend = TestBed.get(MockBackend);

    let storage: MockStorageService = TestBed.get(LocalStorage);
    let auth: AuthService = TestBed.get(AuthService);
    let api: ApiService = TestBed.get(ApiService);

    storage.clear();
    auth.logout();

    backend.connections.subscribe((connection: MockConnection) => {
      let header = connection.request.headers.get('Authorization');
      let token = '';

      if (header !== null) {
        token = header.replace(/JWT /, '');
      }

      if (connection.request.url === `${apiUrl}/user/me` && connection.request.method === RequestMethod.Get) {
        if (
          token === 'token' ||
          token === 'foo-token' ||
          token === 'firebase-missing-token' ||
          token === 'firebase-error-token'
        ) {
          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: user
              })
            )
          );
        } else {
          connection.mockError(
            new MockError(
              new ResponseOptions({
                body: 'Unauthorized',
                status: 401,
                statusText: 'Unauthorized'
              })
            )
          );
        }
      }

      if (
        connection.request.url === `${apiUrl}/auth/firebase/token` &&
        connection.request.method === RequestMethod.Get
      ) {
        if (token === 'token' || token === 'foo-token') {
          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: 'firebasetoken'
              })
            )
          );
        } else if (token === 'firebase-missing-token') {
          connection.mockError(
            new MockError(
              new ResponseOptions({
                body: 'Not found',
                status: 404,
                statusText: 'Not found'
              })
            )
          );
        } else if (token === 'firebase-error-token') {
          connection.mockError(
            new MockError(
              new ResponseOptions({
                body: 'Internal server error',
                status: 500,
                statusText: 'Internal server error'
              })
            )
          );
        } else {
          connection.mockError(
            new MockError(
              new ResponseOptions({
                body: 'Unauthorized',
                status: 401,
                statusText: 'Unauthorized'
              })
            )
          );
        }
      }
    });
  });

  afterEach(() => {
    let storage: MockStorageService = TestBed.get(LocalStorage);
    let auth: AuthService = TestBed.get(AuthService);
    let api: ApiService = TestBed.get(ApiService);

    storage.clear();
    auth.logout();
  });

  it('should get user on init', done => {
    let authService: AuthService = TestBed.get(AuthService);

    authService
      .init('token')
      .then(auth => {
        let responseUser = auth.user;
        expect(responseUser).not.toBeNull();
        if (responseUser !== null) {
          expect(responseUser.id).toEqual(user.id);
        }

        done();
      })
      .catch(err => done.fail(err));
  });

  it('should get auth state after init', done => {
    let authService: AuthService = TestBed.get(AuthService);
    let store: Store<any> = TestBed.get(Store);

    authService
      .init('token')
      .then(auth => {
        expect(auth.user).not.toBeNull();
        if (auth.user !== null) {
          expect(auth.user.id).toEqual(user.id);
        }

        done();
      })
      .catch(err => done.fail(err));
  });

  it('should persist the login token', done => {
    let auth = TestBed.get(AuthService);
    let storage: MockStorageService = TestBed.get(LocalStorage);

    auth
      .init('foo-token')
      .then(() => {
        let token = storage.getItem('token');
        expect(token).toEqual('foo-token');

        done();
      })
      .catch(err => done.fail(err));
  });

  it('should remove the login token after logout', done => {
    let auth: AuthService = TestBed.get(AuthService);
    let storage: MockStorageService = TestBed.get(LocalStorage);
    let store: Store<any> = TestBed.get(Store);

    auth
      .init('foo-token')
      .then(() => {
        let token = storage.getItem('token');
        expect(token).toEqual('foo-token');
        auth.logout();
        token = storage.getItem('token');
        expect(token).toBeFalsy();

        done();
      })
      .catch(err => done.fail(err));
  });
});
