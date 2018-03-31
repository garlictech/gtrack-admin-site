import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationSelectors } from 'subrepos/gtrack-common-ngx';
import { DeepstreamActions } from 'subrepos/gtrack-common-ngx/app/deepstream';
import { Store } from '@ngrx/store';
import { State } from '../store';

const COMPONENTS = [
  LoginComponent
];

@NgModule({
  imports: [CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class AuthModule {
  constructor(
    private _authSelectors: AuthenticationSelectors.Selectors,
    private _store: Store<State>
  ) {
    this._init();
  }

  private _init() {
    this._store
      .select(this._authSelectors.jwtLoggingIn)
      .filter(loggingIn => !loggingIn)
      .switchMapTo(this._store.select(this._authSelectors.token))
      .subscribe(token => this._store.dispatch(new DeepstreamActions.DeepstreamLogin(token)));
  }
}
