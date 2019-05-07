import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { DebugLog } from '../../log';
import { AuthenticationSelectors } from '../../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private readonly _store: Store<any>, private readonly _selectors: AuthenticationSelectors) {}

  @DebugLog canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const enabledRole = route.data.enabledRole;

    return this._store.pipe(
      select(this._selectors.role),
      map(actualRole => actualRole === enabledRole)
    );
  }
}
