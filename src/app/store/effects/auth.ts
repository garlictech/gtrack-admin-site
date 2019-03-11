// tslint:disable:no-property-initializers
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions as AuthActions } from '@bit/garlictech.angular-features.common.authentication-api';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { routingActions } from '../actions';

@Injectable()
export class AuthEffects {
  // Auth guard route forbidden
  @Effect() routeForbidden$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.ROUTE_FORBIDDEN),
    switchMap(data => of(new routingActions.Go(['/login'])))
  );

  // Login
  @Effect() loginSuccess$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    filter(() => this._router.url === '/login'),
    switchMap(() => of(new routingActions.Go(['/'])))
  );

  // Logout
  @Effect() logoutSuccess$: Observable<any> = this._actions$.pipe(
    ofType(AuthActions.LOGOUT_SUCCESS),
    switchMap(() => of(new routingActions.Go(['/login'])))
  );
  constructor(private readonly _actions$: Actions, private readonly _router: Router) {}
}
