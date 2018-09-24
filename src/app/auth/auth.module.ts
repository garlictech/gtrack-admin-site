import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Store, select } from '@ngrx/store';
import { filter, switchMapTo } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthenticationSelectors } from 'subrepos/gtrack-common-ngx';
import { DeepstreamActions } from 'subrepos/gtrack-common-ngx/app/deepstream';

import { LoginComponent } from './components/login';
import { State } from '../store';

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
  constructor(private _authSelectors: AuthenticationSelectors.Selectors, private _store: Store<State>) {
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
