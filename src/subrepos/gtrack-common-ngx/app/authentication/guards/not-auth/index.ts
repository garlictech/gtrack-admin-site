import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMapTo } from 'rxjs/operators';

import { DebugLog } from 'app/log';
import { State } from 'app/store';

import { AuthenticationSelectors } from '../../store';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private readonly _selectors: AuthenticationSelectors.Selectors, private readonly _store: Store<State>) {}

  @DebugLog canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMapTo(this._store.pipe(select(this._selectors.loggedOut)))
    );
  }
}
