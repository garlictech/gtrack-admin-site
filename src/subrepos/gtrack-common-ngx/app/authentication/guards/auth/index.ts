import { switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { Selectors } from '../../store/selectors';
import { DebugLog } from 'app/log';
import { Store, select } from '@ngrx/store';
import { State } from 'app/store';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _selectors: Selectors, private _store: Store<State>) {
    /* EMPTY */
  }

  @DebugLog
  canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMap(() => this._store.pipe(select(this._selectors.loggedIn)))
    );
  }
}
