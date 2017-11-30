import { Http } from '@angular/http';
import { Component, Injector } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions, XHRBackend, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as firebase from 'firebase';

import { ApiModule } from '../../api';
import { ApiService } from '../../api/api.service';
import { AuthService } from '../auth.service';
import { AuthenticationApiConfig, AuthenticationApiModule } from '../../lib';
import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { Reducer as authReducer, IAuthenticationState, domain } from '../../store';
import { User } from '../../lib';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/toPromise';

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

  let mockFirebaseUser: firebase.User = <firebase.User>{
    uid: '1'
  };

  let firebaseConfig = <FirebaseAppConfig>{
    apiKey: 'testApiKey',
    authDomain: 'test-app.firebaseapp.com',
    databaseURL: 'https://test-app.firebaseio.com',
    storageBucket: 'test-app.appspot.com',
    messagingSenderId: '123123123123'
  };

  let apiUrl = 'http://localhost/api';
  let webserverUrl = 'http://localhost/web';

  let authConfig = new AuthenticationApiConfig();

  authConfig.apiUrl = apiUrl;
  authConfig.webserverUrl = webserverUrl;

  let firebaseLoginSpy: jasmine.Spy;
  let firebaseLogoutSpy: jasmine.Spy;

  reducer[domain] = authReducer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.provideStore(combineReducers(reducer)),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AuthenticationApiModule.forRoot(authConfig),
        ApiModule
      ],
      providers: [
        AuthService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: AuthenticationApiConfig,
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
    let af: AngularFireAuth = TestBed.get(AngularFireAuth);

    let storage: MockStorageService = TestBed.get(LocalStorage);
    let auth: AuthService = TestBed.get(AuthService);
    let api: ApiService = TestBed.get(ApiService);

    storage.clear();
    auth.logout();
    api.dispose();

    firebaseLoginSpy = spyOn(af.auth, 'signInWithCustomToken').and.returnValue(Promise.resolve(mockFirebaseUser));
    firebaseLogoutSpy = spyOn(af.auth, 'signOut').and.returnValue(Promise.resolve());

    backend.connections.subscribe((connection: MockConnection) => {
      let header: string = connection.request.headers.get('Authorization');
      let token: string = header.replace(/JWT /, '');

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
    api.dispose();
    auth.logout();
  });

  it('should get user on init', done => {
    let authService: AuthService = TestBed.get(AuthService);

    authService
      .init('token')
      .then(auth => {
        let responseUser = auth.user;
        expect(responseUser.id).toEqual(user.id);
        done();
      })
      .catch(err => done.fail(err));
  });

  it('should get firebase user', done => {
    let authService: AuthService = TestBed.get(AuthService);
    let store: Store<any> = TestBed.get(Store);

    authService
      .init('token')
      .then(auth => {
        let firebaseUser = auth.firebaseUser;

        expect(firebaseLoginSpy.calls.count()).toBe(1);
        expect(firebaseLoginSpy.calls.first().args[0]).toBe('firebasetoken');
        expect(firebaseUser.uid).toEqual(mockFirebaseUser.uid);
        done();
      })
      .catch(err => done.fail(err));
  });

  it("should init when API's firebase URL is disabled", done => {
    let authService: AuthService = TestBed.get(AuthService);
    let store: Store<any> = TestBed.get(Store);

    authService
      .init('firebase-missing-token')
      .then(auth => {
        expect(firebaseLoginSpy.calls.count()).toBe(0);
        expect(auth.firebaseUser).toBeNull();
        expect(auth.firebaseToken).toBeNull();
        expect(auth.user.id).toEqual(user.id);

        done();
      })
      .catch(err => done.fail(err));
  });

  it("should fail when API's firebase URL responds with not 404 errors", done => {
    let auth: AuthService = TestBed.get(AuthService);

    auth
      .init('firebase-error-token')
      .then(() => {
        done.fail(new Error('Not failed'));
      })
      .catch((err: Error | Response) => {
        expect(err instanceof Response).toBeTruthy();
        expect((<Response>err).status).toBe(500);

        done();
      });
  });

  it('should get auth state after init', done => {
    let authService: AuthService = TestBed.get(AuthService);
    let store: Store<any> = TestBed.get(Store);

    authService
      .init('token')
      .then(auth => {
        expect(auth.user.id).toEqual(user.id);
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
