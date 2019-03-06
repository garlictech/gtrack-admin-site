import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { ApiService } from '../api.service';
import { Reducer, AuthenticationState, Actions } from '../../store';

import 'rxjs/add/operator/take';

describe('ApiService', () => {
  const token = 'test-token';
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          authentication: Reducer
        }),
        HttpClientTestingModule
      ],
      providers: [
        ApiService,
        {
          provide: LocalStorage,
          useClass: MockStorageService
        }
      ]
    });

    const localStorage: LocalStorage = TestBed.get(LocalStorage);

    localStorage.setItem('token', token);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Authorization headers to GET', done => {
    const api: ApiService = TestBed.get(ApiService);
    const url = 'http://localhost/user/me';

    api.get(url).subscribe(
      () => {
        done();
      },
      err => {
        done(err);
      }
    );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toEqual(`JWT ${token}`);

    req.flush({});
  });

  it('should add Authorization headers to POST', done => {
    const api: ApiService = TestBed.get(ApiService);
    const url = 'http://localhost/user/me';

    api
      .post(url, {
        test: 5
      })
      .subscribe(
        () => {
          done();
        },
        err => {
          done(err);
        }
      );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.test).toEqual(5);
    expect(req.request.headers.get('Authorization')).toEqual(`JWT ${token}`);

    req.flush({});
  });

  it('should dispatch unauthorized action on 401 response', done => {
    const api: ApiService = TestBed.get(ApiService);
    const url = 'http://localhost/user/me';

    const store: Store<AuthenticationState> = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done();
      }
    });

    api.get(url).subscribe((response: Response) => {
      done.fail(new Error('Not failed'));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');

    req.flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  });

  it('should not emit unauthorized when response code is not 401', done => {
    const api: ApiService = TestBed.get(ApiService);
    const url = 'http://localhost/user/me';
    const store: Store<AuthenticationState> = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done(new Error('Unauthorized emitted'));
      }
    });

    api
      .post(url, {
        test: 1
      })
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          expect(err.statusText).toEqual('Not found');
          done();
        }
      );

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');

    req.flush('Not found', {
      status: 404,
      statusText: 'Not found'
    });
  });

  it('should not emit unauthorized when request failed', done => {
    const api: ApiService = TestBed.get(ApiService);
    const url = 'http://localhost/user/me';
    const store: Store<AuthenticationState> = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callFake(action => {
      if (action instanceof Actions.Unauthorized) {
        done(new Error('Unauthorized emitted'));
      }
    });

    api
      .post(url, {
        test: 1
      })
      .subscribe(
        () => {
          done(new Error('Not failed'));
        },
        (err: ErrorEvent) => {
          done();
        }
      );

    const req = httpTestingController.expectOne(url);

    req.error(new ErrorEvent('Network error'));
  });
});
