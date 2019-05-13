import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';

import { featureName, Reducer as authReducer } from '../../../store';
import { ApiService } from '../../api/api.service';
import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { AuthService } from '../auth.service';

import { take } from 'rxjs/operators';

describe('AuthService', () => {
  const reducer = {};

  const user = {
    id: '1',
    email: 'test@test.com',
    provider: 'facebook'
  };

  let httpTestingController: HttpTestingController;

  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/web';

  reducer[featureName] = authReducer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducer), EffectsModule.forRoot([]), HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: LocalStorage,
          useClass: MockStorageService
        }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);

    const storage: MockStorageService = TestBed.get(LocalStorage);
    const auth: AuthService = TestBed.get(AuthService);
    const api: ApiService = TestBed.get(ApiService);

    storage.clear();
    auth.logout();
  });

  afterEach(() => {
    const storage: MockStorageService = TestBed.get(LocalStorage);
    const auth: AuthService = TestBed.get(AuthService);
    const api: ApiService = TestBed.get(ApiService);

    storage.clear();
    auth.logout();
    httpTestingController.verify();
  });

  it('should get user on init', done => {
    const authService: AuthService = TestBed.get(AuthService);

    authService
      .init('token')
      .pipe(take(1))
      .subscribe(auth => {
        const responseUser = auth.user;
        expect(responseUser).not.toBeNull();
        if (responseUser !== null) {
          expect(responseUser.id).toEqual(user.id);
        }

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req.request.method).toEqual('GET');
    req.flush(user);
  });

  it('should persist the login token', done => {
    const auth = TestBed.get(AuthService);
    const storage: MockStorageService = TestBed.get(LocalStorage);

    auth
      .init('foo-token')
      .pipe(take(1))
      .subscribe(() => {
        const token = storage.getItem('token');
        expect(token).toEqual('foo-token');

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req.request.method).toEqual('GET');
    req.flush(user);
  });

  it('should remove the login token after logout', done => {
    const auth: AuthService = TestBed.get(AuthService);
    const storage: MockStorageService = TestBed.get(LocalStorage);
    const store: Store<any> = TestBed.get(Store);

    auth
      .init('foo-token')
      .pipe(take(1))
      .subscribe(() => {
        let token = storage.getItem('token');
        expect(token).toEqual('foo-token');
        auth.logout();
        token = storage.getItem('token');
        expect(token).toBeFalsy();

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req.request.method).toEqual('GET');
    req.flush(user);
  });
});
