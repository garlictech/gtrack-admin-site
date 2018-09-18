import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as Action from '../store/actions';
import { DebugLog } from '../log';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private store: Store<any>) {}

  @DebugLog
  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<boolean> {
    return this.auth.authenticated
      .pipe(
        map(() => true),
        catchError(() => of(false)),
        tap(authenticated => {
          if (authenticated === false) {
            this.store.dispatch(new Action.RouteForbidden(route, state));
          }
        })
      );
  }
}
