import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { take } from 'rxjs/operators';

import { PasswordlessService } from '../passwordless.service';
import { Reducer as authReducer } from '../../store';
import { defaultAuthenticationApiConfig, AuthenticationApiModule, MagiclinkConfig, AUTH_CONFIG_TOKEN } from '../../lib';

import { ApiModule } from '../../api';
import { LocalStorage } from '../../storage/local-storage.service';

describe('PasswordlessService', () => {
  const passwordlessConfig: MagiclinkConfig = {
    redirectSlug: '/magiclink'
  };

  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/web';

  let httpTestingController: HttpTestingController;

  const config = { ...defaultAuthenticationApiConfig };
  config.webserverUrl = webserverUrl;
  config.apiUrl = apiUrl;

  config.magiclink = passwordlessConfig;

  const user = {
    id: '1',
    email: 'test@test.com',
    provider: 'passwordless'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        EffectsModule.forRoot([]),
        AuthenticationApiModule.forRoot(config),
        ApiModule,
        HttpClientTestingModule
      ],
      providers: [
        PasswordlessService,
        {
          provide: AUTH_CONFIG_TOKEN,
          useFactory: () => config
        }
      ]
    });

    const storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();

    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    const storage: LocalStorage = TestBed.get(LocalStorage);
    storage.clear();
    httpTestingController.verify();
  });

  it('should request token', done => {
    const passwordless: PasswordlessService = TestBed.get(PasswordlessService);

    passwordless
      .requestToken('test@test.com')
      .pipe(take(1))
      .subscribe(() => done(), done);

    const req = httpTestingController.expectOne(`${apiUrl}/auth/passwordless/token/request`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.user).toEqual('test@test.com');

    req.flush({
      success: true
    });
  });

  it('should request token with language', done => {
    const passwordless: PasswordlessService = TestBed.get(PasswordlessService);

    passwordless
      .requestToken('test@test.com', 'hu_HU')
      .pipe(take(1))
      .subscribe(() => done(), done);

    const req = httpTestingController.expectOne(`${apiUrl}/auth/passwordless/token/request`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.user).toEqual('test@test.com');
    expect(req.request.body.language).toEqual('hu_HU');

    req.flush({
      success: true
    });
  });

  it('should send token to API', done => {
    const passwordless: PasswordlessService = TestBed.get(PasswordlessService);

    passwordless
      .callback('xac32k', 'test@test.com')
      .pipe(take(1))
      .subscribe(response => {
        expect(response.token).toEqual('token');
        expect(response.user).toEqual(
          expect.objectContaining({
            email: 'test@test.com',
            provider: 'passwordless'
          })
        );

        done();
      }, done);

    const req = httpTestingController.expectOne(`${apiUrl}/auth/passwordless/token`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.token).toEqual('xac32k');
    expect(req.request.body.uid).toEqual('test@test.com');

    req.flush({
      token: 'token'
    });

    const req2 = httpTestingController.expectOne(`${apiUrl}/user/me`);
    expect(req2.request.method).toEqual('GET');

    req2.flush(user);
  });
});
