import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMapTo, take, tap } from 'rxjs/operators';
import { AuthenticationActions, AuthenticationSelectors } from '../../store';

export class LoginHandle {
  protected _selectedRole$: Observable<string>;

  constructor(protected _store: Store<any>, protected _selectors: AuthenticationSelectors.Selectors) {
    this._selectedRole$ = this._store.pipe(select(this._selectors.selectedRole));
  }

  protected _login(successAction: any): Observable<any> {
    return this._store.pipe(
      select(this._selectors.termsAccepted),
      take(1),
      tap(termsAccepted =>
        this._store.dispatch(termsAccepted ? successAction : new AuthenticationActions.LoginRefused())
      ),
      switchMapTo(this._store.pipe(select(this._selectors.loggedIn))),
      filter(loggedIn => loggedIn),
      switchMapTo(this._store.pipe(select(this._selectors.role))),
      take(1),
      tap(role => this._store.dispatch(new RouterActions.Go([role])))
    );
  }
}
