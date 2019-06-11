import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first, map, pluck, switchMapTo } from 'rxjs/operators';
import { DebugLog } from '../../log';
import { AuthenticationSelectors } from '../../store';

@Component({
  selector: 'app-authentication-widget',
  template: ''
})
export class WidgetComponent implements OnInit {
  selectedRole: string;
  isLoggingIn$: Observable<boolean>;
  message$: Observable<string>;

  constructor(
    private readonly _authSelectors: AuthenticationSelectors.Selectors,
    private readonly _route: ActivatedRoute,
    private readonly _store: Store<any>
  ) {
    this.selectedRole = 'user';
  }

  @DebugLog ngOnInit(): void {
    this.isLoggingIn$ = this._store.pipe(select(this._authSelectors.loggingIn));
    this.message$ = this._route.params.pipe(map(params => `authentication.${params.message}`));

    this._store
      .pipe(
        select(this._authSelectors.loggedIn),
        filter(loggedIn => loggedIn),
        first(),
        switchMapTo(this._route.params),
        pluck('targetUrl'),
        filter((targetUrl: string) => !!targetUrl)
      )
      .subscribe((targetUrl: string) => this._store.dispatch(new RouterActions.Go([targetUrl])));
  }
}
