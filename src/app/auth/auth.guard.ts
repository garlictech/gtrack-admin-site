import { State } from 'app/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, switchMap, switchMapTo } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Actions as AuthActions } from '@bit/garlictech.angular-features.common.authentication-api';
import { AuthGuard, RoleGuard } from '@bit/garlictech.angular-features.common.authentication/guards';
import { AuthenticationSelectors } from '@bit/garlictech.angular-features.common.authentication/store';
import { select, Store } from '@ngrx/store';

@Injectable()
export class RouteRedirectGuard implements CanActivate {
  constructor(
    private readonly _auth: AuthGuard,
    private readonly _role: RoleGuard,
    private readonly _store: Store<State>,
    private readonly _selectors: AuthenticationSelectors.Selectors
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMapTo(
        combineLatest(this._auth.canActivate(), this._role.canActivate(route)).pipe(
          switchMap(results => {
            const can = results[0] && results[1];

            if (!can) {
              this._store.dispatch(new AuthActions.RouteForbidden(route, state));
            }

            return of(can);
          })
        )
      )
    );
  }
}
