import { routingActions } from 'app/store/actions';
import { cold, hot } from 'jest-marbles';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { Actions as AuthActions } from '@bit/garlictech.angular-features.common.authentication-api';
import { DeepstreamService, DeepstreamModule } from '@bit/garlictech.angular-features.common.deepstream-ngx';

import { AuthEffects } from '../auth';
import { mockRouter } from './helpers';

describe('Auth effects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([AuthEffects]),
        HttpClientTestingModule,
        DeepstreamModule,
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
      const action = new AuthActions.LoginSuccess(undefined);
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
