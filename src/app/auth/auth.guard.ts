import { of, combineLatest, Observable } from 'rxjs';
import { filter, switchMapTo, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from 'app/store';
import { AuthenticationSelectors } from 'subrepos/gtrack-common-ngx';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { AuthGuard, RoleGuard } from 'subrepos/gtrack-common-ngx/app/authentication/guards';

@Injectable()
export class RouteRedirectGuard implements CanActivate {
  constructor(
    private _auth: AuthGuard,
    private _role: RoleGuard,
    private _store: Store<State>,
    private _selectors: AuthenticationSelectors.Selectors
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
