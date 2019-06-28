import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
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
  VerifySuccessComponent,
  WidgetComponent
} from './components';
import { AUTH_CONFIG } from './config';
import { DebugLog, log } from './log';
import { AuthService } from './services';
import {
  Auth,
  AUTHENTICATION_REDUCER_TOKEN,
  AuthenticationActions,
  AuthenticationSelectors,
  featureName,
  getReducers
} from './store';
import { Effects } from './store/effects';

// tslint:disable-next-line: only-arrow-functions
export function initializerFactory(auth: AuthService, store: Store<any>): () => void {
  // tslint:disable-next-line: only-arrow-functions
  return function(): void {
    log.data('[AuthenticationApiModule:app init] Retrieving authentication info with stored token...');
    auth.authenticated.subscribe(
      (authData: Auth) => {
        store.dispatch(new AuthenticationActions.LoginSuccess(authData));
      },
      err => {
        log.info('Authentication lib init: not authenticated');
      }
    );
  };
}

@NgModule({
  declarations: [
    EmailSentComponent,
    FacebookLoginButtonComponent,
    GoogleLoginButtonComponent,
    LoginBoxComponent,
    PasswordlessSuccessComponent,
    VerifySuccessComponent,
    WidgetComponent
  ],
  imports: [
    StoreModule.forFeature(featureName, AUTHENTICATION_REDUCER_TOKEN),
    EffectsModule.forFeature([Effects]),
    HttpClientModule
  ],
  exports: [LoginBoxComponent, WidgetComponent]
})
export class AuthenticationModule {
  static forRoot(config): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        { provide: AUTHENTICATION_REDUCER_TOKEN, useFactory: getReducers },
        { provide: AUTH_CONFIG, useValue: config }
      ]
    };
  }

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
        switchMapTo(this._store.pipe(select(this._authSelectors.selectAuthHeader)))
      )
      .subscribe(header => this._store.dispatch(new DeepstreamActions.DeepstreamLogin(header)));

    this._loaderWatch.spinnerOnWorking$(this._authSelectors.loggingIn, 'authentication.loggingIn').subscribe();
  }
}
