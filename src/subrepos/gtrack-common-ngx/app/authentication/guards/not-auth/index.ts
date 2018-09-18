import { switchMapTo, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { DebugLog } from 'app/log';
import { State } from 'app/store';

import { AuthenticationSelectors } from '../../store';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private _selectors: AuthenticationSelectors.Selectors, private _store: Store<State>) {
    /* EMPTY */
  }

  @DebugLog
  canActivate(): Observable<boolean> {
<<<<<<< HEAD
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMapTo(this._store.pipe(select(this._selectors.loggedOut)))
    );
=======
    return this._store
      .pipe(
        select(this._selectors.loggingIn),
        filter(loggingIn => !loggingIn),
        switchMapTo(this._store.pipe(select(this._selectors.loggedOut)))
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }
}
