import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { DebugLog } from '../log';
import * as Action from '../store/actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly store: Store<any>) {}

  @DebugLog canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.auth.authenticated.pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(authenticated => {
        if (!authenticated) {
          this.store.dispatch(new Action.RouteForbidden(route, state));
        }
      })
    );
  }
}
