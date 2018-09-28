import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { AuthEffects } from '../auth';
import { Actions as AuthActions } from '../../../../subrepos/authentication-api-ngx';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule } from '../../../../subrepos/gtrack-common-ngx';
import { TestActions, getActions, mockRouter } from './helpers';

import * as _ from 'lodash';

describe('Auth effects', () => {
  let actions$: TestActions;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([
          AuthEffects
        ]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        AuthEffects,
        {
          provide: Actions,
          useFactory: getActions
        },
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
      const expected = cold('');

      actions$.stream = hot('-a', { a: action });

      expect(effects.routeForbidden$).toBeObservable(expected);
    });
  });

  describe('loginSuccess$', () => {
    TestBed.overrideProvider(Router, { useValue: _.merge(mockRouter, {
      url: '/login'
    }) });

    it('should return empty observable from LoginSuccess', () => {
      const action = new AuthActions.LoginSuccess(null);
      const expected = cold('');

      actions$.stream = hot('-a', { a: action });

      expect(effects.loginSuccess$).toBeObservable(expected);
    });
  });

  describe('logoutSuccess$', () => {
    it('should return empty observable from LogoutSuccess', () => {
      const action = new AuthActions.LogoutSuccess();
      const expected = cold('');

      actions$.stream = hot('-a', { a: action });

      expect(effects.logoutSuccess$).toBeObservable(expected);
    });
  });
});
