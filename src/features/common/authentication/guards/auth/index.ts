import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { DebugLog } from '../../log';
import { AuthenticationSelectors } from '../../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly _selectors: AuthenticationSelectors, private readonly _store: Store<any>) {}

  @DebugLog canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMap(() => this._store.pipe(select(this._selectors.loggedIn)))
    );
  }
}
