import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { AUTH_CONFIG_TOKEN, AuthenticationApiModule, defaultAuthenticationApiConfig } from '../../lib';
import { AuthGuard } from '../auth-guard.service';

import { domain, Reducer as authReducer } from '../../store';
import * as Actions from '../../store/actions';

describe('AuthGuard', () => {
  class MockRouterService {
    url = '';

    navigate(commands: Array<any>) {
      this.url = commands.join('/');
    }
  }

  const reducer = {};
  reducer[domain] = authReducer;

  const apiUrl = 'http://localhost/api';
  const webserverUrl = 'http://localhost/api';

  const authConfig = { ...defaultAuthenticationApiConfig };

  authConfig.apiUrl = apiUrl;
  authConfig.webserverUrl = webserverUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducer), EffectsModule.forRoot([]), AuthenticationApiModule.forRoot(authConfig)],
      providers: [
        {
          provide: Router,
          useClass: MockRouterService
        },
        {
          provide: AUTH_CONFIG_TOKEN,
          useFactory: () => authConfig
        },
        AuthGuard
      ]
    });
  });

  it('should return false if user is not logged in', done => {
    const guard: AuthGuard = TestBed.get(AuthGuard);
    const router: MockRouterService = TestBed.get(Router);

    guard.canActivate().subscribe((canActivate: boolean) => {
      expect(canActivate).toEqual(false);
      done();
    });
  });

  it('should dispatch ROUTE_FORBIDDEN action if user is not logged in', done => {
    const store: Store<any> = TestBed.get(Store);
    const guard: AuthGuard = TestBed.get(AuthGuard);
    const router: MockRouterService = TestBed.get(Router);
    const action = new Actions.RouteForbidden();

    spyOn(store, 'dispatch').and.callThrough();

    guard.canActivate().subscribe((canActivate: boolean) => {
      expect(canActivate).toEqual(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
      done();
    });
  });
});
