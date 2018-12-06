import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { State } from 'app/store';
import { Selectors } from '../../store/selectors';
import { DebugLog } from 'app/log';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private _store: Store<State>, private _selectors: Selectors) {
    /* EMPTY */
  }

  @DebugLog
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const enabledRole = route.data.enabledRole;
    return this._store.pipe(
      select(this._selectors.role),
      map(actualRole => actualRole === enabledRole)
    );
  }
}
