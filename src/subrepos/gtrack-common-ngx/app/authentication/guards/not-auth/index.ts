import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { log, DebugLog } from 'app/log';
import { State } from 'app/store';

import { AuthenticationSelectors } from '../../store/';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private _selectors: AuthenticationSelectors.Selectors, private _store: Store<State>) {
    /* EMPTY */
  }

  @DebugLog
  canActivate(): Observable<boolean> {
    return this._store
      .select(this._selectors.loggingIn)
      .filter(loggingIn => !loggingIn)
      .switchMapTo(this._store.select(this._selectors.loggedOut));
  }
}
