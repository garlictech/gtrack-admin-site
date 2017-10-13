import { AuthService } from '../auth.service';
import { AuthGuard } from '../auth-guard.service';
import { Http } from '@angular/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Subject } from 'rxjs/Subject';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationApiConfig, AuthenticationApiModule } from '../../lib';

import { IAuthenticationState, Reducer as authReducer, domain } from '../../store';
import * as Actions from '../../store/actions';

describe('AuthGuard', () => {
  class MockRouterService {
    public url = '';

    public navigate(commands: any[]) {
      this.url = commands.join('/');
    }
  }

  let reducer = {};
  reducer[domain] = authReducer;

  let apiUrl = 'http://localhost/api';
  let webserverUrl = 'http://localhost/api';

  let authConfig = new AuthenticationApiConfig();

  authConfig.apiUrl = apiUrl;
  authConfig.webserverUrl = webserverUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.provideStore(combineReducers(reducer)), AuthenticationApiModule.forRoot(authConfig)],
      providers: [
        {
          provide: Router,
          useClass: MockRouterService
        },
        {
          provide: AuthenticationApiConfig,
          useFactory: () => authConfig
        },
        AuthGuard
      ]
    });
  });

  it('should return false if user is not logged in', done => {
    let guard: AuthGuard = TestBed.get(AuthGuard);
    let router: MockRouterService = TestBed.get(Router);

    guard.canActivate().subscribe((canActivate: boolean) => {
      expect(canActivate).toEqual(false);
      done();
    });
  });

  it('should dispatch ROUTE_FORBIDDEN action if user is not logged in', done => {
    let store: Store<any> = TestBed.get(Store);
    let guard: AuthGuard = TestBed.get(AuthGuard);
    let router: MockRouterService = TestBed.get(Router);
    let action = new Actions.RouteForbidden({
      route: undefined,
      state: undefined
    });

    spyOn(store, 'dispatch').and.callThrough();

    guard.canActivate().subscribe((canActivate: boolean) => {
      expect(canActivate).toEqual(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
      done();
    });
  });
});
