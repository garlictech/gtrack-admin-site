import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { filter, switchMapTo } from 'rxjs/operators';
import { AuthenticationSelectors } from 'subrepos/gtrack-common-ngx';
import { DeepstreamActions } from 'subrepos/gtrack-common-ngx/app/deepstream';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';

import { State } from '../store';
import { LoginComponent } from './components/login';

const COMPONENTS = [LoginComponent];

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    // PrimeNG
    ButtonModule,
    CardModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class AuthModule {
  constructor(
    private readonly _authSelectors: AuthenticationSelectors.Selectors,
    private readonly _store: Store<State>
  ) {
    this._init();
  }

  private _init() {
    this._store
      .pipe(
        select(this._authSelectors.jwtLoggingIn),
        filter(loggingIn => !loggingIn),
        switchMapTo(this._store.pipe(select(this._authSelectors.token)))
      )
      .subscribe(token => this._store.dispatch(new DeepstreamActions.DeepstreamLogin(token)));
  }
}
