import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { DebugLog } from 'app/log';
import { State } from 'app/store';
import { Selectors } from '../../store/selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _selectors: Selectors, private readonly _store: Store<State>) {}

  @DebugLog canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMap(() => this._store.pipe(select(this._selectors.loggedIn)))
    );
  }
}
