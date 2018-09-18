import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ApiModule } from '../../api';
import { ApiService } from '../../api/api.service';
import { AuthService } from '../auth.service';
import { defaultAuthenticationApiConfig, AUTH_CONFIG_TOKEN, AuthenticationApiModule } from '../../lib';
import { LocalStorage } from '../../storage/local-storage.service';
import { MockStorageService } from '../../storage/test/mock-storage.service';
import { Reducer as authReducer, domain } from '../../store';

<<<<<<< HEAD
=======

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { take } from 'rxjs/operators';

describe('AuthService', () => {
  const reducer = {};

  const user = {
    id: '1',
    email: 'test@test.com',
    provider: 'facebook'
  };

  let httpTestingController: HttpTestingController;
<<<<<<< HEAD

  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/web';

=======

  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/web';

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  const authConfig = { ...defaultAuthenticationApiConfig };

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
        ApiModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        {
          provide: AUTH_CONFIG_TOKEN,
          useValue: authConfig
        },
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
