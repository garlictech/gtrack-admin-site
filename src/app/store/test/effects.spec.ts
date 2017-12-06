import { TestBed, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Rx';
import { Action } from '@ngrx/store';
import { Actions as AuthActions } from 'authentication-api-ngx';
import * as GtActions from '../actions';
import { Effects } from '../effects';

describe('Effects', () => {
  let runner: EffectsRunner;
  let effects: Effects;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [EffectsTestingModule],
      providers: [Effects]
    })
  );

  beforeEach(
    inject([EffectsRunner, Effects], (_runner: EffectsRunner, _effects: Effects) => {
      runner = _runner;
      effects = _effects;
    })
  );

  it('should return a login redirect action after authorization failed', () => {
    const expectedResult = {
      type: '[Router] Go',
      payload: Object({
        path: ['/login'],
        query: undefined,
        extras: undefined
      })
    };

    runner.queue({ type: AuthActions.ROUTE_FORBIDDEN });
    effects.routeForbidden$.subscribe(result => {
      expect(result).toEqual(expectedResult);
    });
  });

  it('should return a home redirect action after succesfull login', () => {
    const expectedResult = {
      type: '[Router] Go',
      payload: Object({
        path: ['/'],
        query: undefined,
        extras: undefined
      })
    };

    runner.queue({ type: AuthActions.LOGIN_SUCCESS });
    effects.loginSuccess$.subscribe(result => {
      expect(result).toEqual(expectedResult);
    });
  });

  it('should return a login redirect action after logout', () => {
    const expectedResult = {
      type: '[Router] Go',
      payload: Object({
        path: ['/login'],
        query: undefined,
        extras: undefined
      })
    };

    runner.queue({ type: AuthActions.LOGOUT_SUCCESS });
    effects.logoutSuccess$.subscribe(result => {
      expect(result).toEqual(expectedResult);
    });
  });

  it('should return an empty response after save hike', () => {
    runner.queue({ type: GtActions.SAVE_HIKE });
    effects.saveHike$.subscribe(result => {
      expect(result).toBeDefined();
    });
  });

  it('should return an empty response after delete hike', () => {
    runner.queue({ type: GtActions.DELETE_HIKE });
    effects.deleteHike$.subscribe(result => {
      expect(result).toBeDefined();
    });
  });
});
