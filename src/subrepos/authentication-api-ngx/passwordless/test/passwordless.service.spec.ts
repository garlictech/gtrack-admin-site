import { Http } from '@angular/http';
import { Component, Injector } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions, XHRBackend, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { PasswordlessService } from '../passwordless.service';
import { AuthModule } from '../../auth';
import { Reducer as authReducer } from '../../store';
import { AuthenticationApiConfig, AuthenticationApiModule, IMagiclinkConfig } from '../../lib';

import { ApiModule } from '../../api';
import { LocalStorage } from '../../storage/local-storage.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/elementAt';

describe('PasswordlessService', () => {
  let passwordlessConfig: IMagiclinkConfig = {
    redirectSlug: '/magiclink'
  };

  let apiUrl = 'http://localhost/api';
  let webserverUrl = 'http://localhost/web';

  let config = new AuthenticationApiConfig();
  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;

  config.magiclink = passwordlessConfig;

  let user = {
    _id: '1',
    email: 'test@test.com',
    provider: 'passwordless'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.provideStore(authReducer), AuthenticationApiModule.forRoot(config), ApiModule],
      providers: [
        BaseRequestOptions,
        MockBackend,
        PasswordlessService,
        {
          provide: AuthenticationApiConfig,
          useFactory: () => config
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

    backend.connections.subscribe((connection: MockConnection) => {
      if (connection.request.url === `${apiUrl}/user/me` && connection.request.method === RequestMethod.Get) {
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: user
            })
          )
        );
      }
    });

    let storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();
  });

  afterEach(() => {
    let storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();
  });

  it('should request token', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let passwordless: PasswordlessService = TestBed.get(PasswordlessService);
    let oldRedirectUri = config.magiclink.redirectSlug;

    backend.connections.elementAt(1).subscribe((connection: MockConnection) => {
      let body: any = connection.request.json();
      expect(body.language).toEqual('hu_HU');
    });

    backend.connections.take(2).subscribe((connection: MockConnection) => {
      let body: any = connection.request.json();
      let data = {
        success: true
      };

      let options = new ResponseOptions({
        body: data
      });

      let response: Response = new Response(options);

      expect(connection.request.url).toEqual(`${apiUrl}/auth/passwordless/token/request`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(body.user).toEqual('test@test.com');

      connection.mockRespond(response);
    });

    passwordless
      .requestToken('test@test.com')
      .toPromise()
      .then(() => {
        config.magiclink.redirectSlug = undefined;

        return passwordless.requestToken('test@test.com', 'hu_HU').toPromise();
      })
      .then(() => {
        config.magiclink.redirectSlug = oldRedirectUri;
      })
      .then(done)
      .catch(err => {
        config.magiclink.redirectSlug = oldRedirectUri;
        done.fail(err);
      });
  });

  it('should send token to API', function(done) {
    let backend: MockBackend = TestBed.get(MockBackend);
    let passwordless: PasswordlessService = TestBed.get(PasswordlessService);

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      let data = {
        token: 'token'
      };

      let options = new ResponseOptions({
        body: data
      });

      let response: Response = new Response(options);
      let json = connection.request.getBody();
      let body = JSON.parse(json);

      expect(connection.request.url).toEqual(`${apiUrl}/auth/passwordless/token`);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(body.token).toEqual('xac32k');
      expect(body.uid).toEqual('test@test.com');

      connection.mockRespond(response);
    });

    passwordless.callback('xac32k', 'test@test.com').then(done).catch(err => done.fail(err));
  });
});
