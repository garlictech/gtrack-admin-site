import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jest-marbles';
import { routingActions } from 'app/store/actions';
import { AuthEffects } from '../auth';
import { Actions as AuthActions } from '../../../../subrepos/authentication-api-ngx';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule } from '../../../../subrepos/gtrack-common-ngx';
import { mockRouter } from './helpers';

import * as _ from 'lodash';

describe('Auth effects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([AuthEffects]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(AuthEffects);
  });

  describe('routeForbidden$', () => {
    it('should return empty observable from RouteForbidden', () => {
      const action = new AuthActions.RouteForbidden();
      const completion = new routingActions.Go(['/login']);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.routeForbidden$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    it('should return empty observable from LoginSuccess', () => {
      const action = new AuthActions.LoginSuccess(null);
      const completion = new routingActions.Go(['/']);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loginSuccess$).toBeObservable(expected);
    });
  });

  describe('logoutSuccess$', () => {
    it('should return empty observable from LogoutSuccess', () => {
      const action = new AuthActions.LogoutSuccess();
      const completion = new routingActions.Go(['/login']);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.logoutSuccess$).toBeObservable(expected);
    });
  });
});
