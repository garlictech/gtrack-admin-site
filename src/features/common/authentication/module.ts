import { NgModule } from '@angular/core';
import { Actions as DeepstreamActions } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { LoaderWatchService } from '@bit/garlictech.angular-features.common.generic-ui';
import { Actions as PopupActions } from '@bit/garlictech.angular-features.common.popup';
import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { EffectsModule } from '@ngrx/effects';
import { select, Store, StoreModule } from '@ngrx/store';
import { filter, switchMapTo } from 'rxjs/operators';
import {
  EmailSentComponent,
  FacebookLoginButtonComponent,
  GoogleLoginButtonComponent,
  LoginBoxComponent,
  PasswordlessSuccessComponent,
  WidgetComponent
} from './components';
import { DebugLog, log } from './log';
import { AUTHENTICATION_REDUCER_TOKEN, AuthenticationSelectors, Effects, featureName, getReducers } from './store';

@NgModule({
  declarations: [
    EmailSentComponent,
    FacebookLoginButtonComponent,
    GoogleLoginButtonComponent,
    LoginBoxComponent,
    PasswordlessSuccessComponent,
    WidgetComponent
  ],
  imports: [StoreModule.forFeature(featureName, AUTHENTICATION_REDUCER_TOKEN), EffectsModule.forFeature([Effects])],
  exports: [LoginBoxComponent, WidgetComponent],
  providers: [{ provide: AUTHENTICATION_REDUCER_TOKEN, useFactory: getReducers }]
})
export class AuthenticationModule {
  constructor(
    private readonly _authSelectors: AuthenticationSelectors.Selectors,
    private readonly _store: Store<any>,
    private readonly _loaderWatch: LoaderWatchService
  ) {
    this._init();
  }

  @DebugLog _init(): void {
    this._store.pipe(select(this._authSelectors.loginFailed)).subscribe((failed: boolean) => {
      if (failed) {
        log.error('Login failed');
        this._store.dispatch(
          new PopupActions.ShowPopup({
            message: 'authentication.loginError',
            title: ''
          })
        );
        this._store.dispatch(new RouterActions.Go(['auth', 'login']));
      }
    });

    this._store.pipe(select(this._authSelectors.magicLinkEmailSent)).subscribe((emailSent: boolean) => {
      if (emailSent) {
        log.info('Magic Link email sent');
        this._store.dispatch(new RouterActions.Go(['auth', 'email-sent']));
      }
    });

    this._store
      .pipe(
        select(this._authSelectors.jwtLoggingIn),
        filter(loggingIn => !loggingIn),
        switchMapTo(this._store.pipe(select(this._authSelectors.token)))
      )
      .subscribe(token => this._store.dispatch(new DeepstreamActions.DeepstreamLogin(token)));

    this._loaderWatch.spinnerOnWorking$(this._authSelectors.loggingIn, 'authentication.loggingIn').subscribe();
  }
}
