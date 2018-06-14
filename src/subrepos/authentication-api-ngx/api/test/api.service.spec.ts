import { Http } from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { Component, Injector } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions, XHRBackend, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, Observable } from 'rxjs';

import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { ApiService } from '../api.service';
import { Reducer, IAuthenticationState, Actions } from '../../store';

import 'rxjs/add/operator/take';

class MockError extends Response implements Error {
  name: any;
  message: any;
}

describe('ApiService', () => {
  let token = 'test-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          authentication: Reducer
        })
      ],
      providers: [
        ApiService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: LocalStorage,
          useClass: MockStorageService
        },
        {
          deps: [MockBackend, BaseRequestOptions],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });

    let localStorage: LocalStorage = TestBed.get(LocalStorage);

    localStorage.setItem('token', token);
  });

  it('should add Authorization headers to GET', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let api: ApiService = TestBed.get(ApiService);
    let url = 'http://localhost/user/me';

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(url);
      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.headers.get('Authorization')).toEqual('JWT ' + token);
      done();
    });

    api.get(url).catch(err => {
      done.fail(err);
      return Observable.of();
    });
  });

  it('should add Authorization headers to POST', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let api: ApiService = TestBed.get(ApiService);
    let url = 'http://localhost/user/me';

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(url);
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Authorization')).toEqual('JWT ' + token);
      done();
    });

    api
      .post(url, {
        test: 5
      })
      .catch(err => {
        done.fail(err);
        return Observable.of();
      });
  });

  it('should dispatch unauthorized action on 401 response', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let api: ApiService = TestBed.get(ApiService);
    let url = 'http://localhost/user/me';

    let store: Store<IAuthenticationState> = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done();
      }
    });

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      connection.mockError(
        new MockError(
          new ResponseOptions({
            body: 'Unauthorized',
            status: 401,
            statusText: 'Unauthorized'
          })
        )
      );
    });

    api
      .get(url)
      .toPromise()
      .then((response: Response) => {
        done.fail(new Error('Not failed'));
      })
      .catch((err: MockError) => {
        // Prevent Unhandled Promise rejection errors
      });
  });

  it('should not emit unauthorized when response code is not 401', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let api: ApiService = TestBed.get(ApiService);
    let url = 'http://localhost/user/me';
    let store: Store<IAuthenticationState> = TestBed.get(Store);

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      connection.mockError(
        new MockError(
          new ResponseOptions({
            body: 'Not found',
            status: 404,
            statusText: 'Not found'
          })
        )
      );
    });

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done.fail(new Error('Unauthorized emitted'));
      }
    });

    api
      .post(url, {
        test: 1
      })
      .toPromise()
      .then((response: Response) => {
        done.fail(new Error('Not failed'));
      })
      .catch((err: MockError) => {
        done();
      });
  });

  it('should not emit unauthorized when request failed', done => {
    let backend: MockBackend = TestBed.get(MockBackend);
    let api: ApiService = TestBed.get(ApiService);
    let url = 'http://localhost/user/me';
    let store: Store<IAuthenticationState> = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done.fail(new Error('Unauthorized emitted'));
      }
    });

    backend.connections.take(1).subscribe((connection: MockConnection) => {
      connection.mockError(new Error('Destination host is unreachable'));
    });

    api
      .post(url, {
        test: 1
      })
      .toPromise()
      .then((response: Response) => {
        done.fail(new Error('Not failed'));
      })
      .catch(err => {
        done();
      });
  });
});
