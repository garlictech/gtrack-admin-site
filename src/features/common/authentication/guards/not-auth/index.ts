import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMapTo } from 'rxjs/operators';
import { DebugLog } from '../../log';
import { Selectors } from '../../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {
  constructor(private readonly _selectors: Selectors, private readonly _store: Store<any>) {}

  @DebugLog canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(this._selectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMapTo(this._store.pipe(select(this._selectors.loggedOut)))
    );
  }
}
