// tslint:disable:no-property-initializers no-identical-functions
import { asyncScheduler, empty, from, Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import {
  PasswordlessLoginService,
  SocialLoginService
} from '@bit/garlictech.angular-features.common.authentication-cognito';
import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { log } from '../log';
import { AuthService } from '../services';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  @Effect() init$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.Init>(LocalActions.AuthenticationActionTypes.INIT),
    switchMap(() =>
      this._auth.authenticated.pipe(
        map(authData => new LocalActions.LoginSuccess(authData)),
        catchError(() => {
          log.info('Authentication lib init: not authenticated');

          return empty();
        })
      )
    )

    // from(this._loginService.isAuthenticated()).pipe(
    //   tap(console.log),
    //   switchMap(() =>
    //     from(this._loginService.getSession()).pipe(
    //       switchMap(authData => {
    //         log.info('Auth data:', authData);

    //         return this._auth.saveCognitoUser(authData).pipe(map(auth => new LocalActions.LoginSuccess(auth)));
    //       })
    //     )
    //   ),
    //   catchError(() => {
    //     log.info('Authentication lib init: not authenticated');

    //     return empty();
    //   })
    // )
  );

  @Effect() effectInit$ = of(new LocalActions.Init(), asyncScheduler);

  // Verify
  @Effect() verify$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.Verify>(LocalActions.AuthenticationActionTypes.VERIFY),
    switchMap(action => {
      log.data('Effect: Verify initiated');

      return from(this._auth.verify(action.token, action.uid)).pipe(
        map(auth => {
          log.info('Effect: Verify success');

          return new LocalActions.LoginSuccess(auth);
        }),
        catchError(err => {
          log.error('Effect: Verify error', err);

          return of(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Google login
  @Effect({ dispatch: false }) googleLogin$: Observable<any> = this._actions$.pipe(
    ofType<LocalActions.GoogleLogin>(LocalActions.AuthenticationActionTypes.GOOGLE_LOGIN),
    switchMap(action => {
      log.data('Effect: Google login initiated');

      return from(this._socialLoginService.connect('Google', action.roles));
    })
  );

  // Facebook login
  @Effect({ dispatch: false }) facebookLogin$: Observable<any> = this._actions$.pipe(
    ofType<LocalActions.FacebookLogin>(LocalActions.AuthenticationActionTypes.FACEBOOK_LOGIN),
    switchMap(action => {
      log.data('Effect: Facebook login initiated');

      return from(this._socialLoginService.connect('Facebook', action.roles));
    })
  );

  // Magic Link login
  @Effect() magiclinkRequestToken$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.RequestMagicLinkToken>(LocalActions.AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN),
    switchMap(action => {
      log.data('Effect: Magic Link login initiated');

      return from(this._loginService.signUp(action.email)).pipe(
        switchMap(() =>
          from(this._loginService.signIn(action.email)).pipe(
            map(() => {
              log.info('Effect: Magic Link email sent');

              return new LocalActions.MagicLinkEmailSent();
            }),
            catchError(err => {
              log.error('Effect: Magic Link email sending', err);

              return of(new LocalActions.FailureHappened(err));
            })
          )
        )
      );
    })
  );

  // Magic Link login
  @Effect() magiclinkLogin$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.MagicLinkLogin>(LocalActions.AuthenticationActionTypes.MAGICLINK_LOGIN),
    switchMap(action => {
      log.data('Effect: Magic Link login continued');

      return from(this._loginService.answerCustomChallenge(action.token)).pipe(
        filter(authenticated => authenticated),
        switchMap(() => {
          log.info('Effect: Magic Link login success');

          return from(this._loginService.getSession()).pipe(
            switchMap(authData => {
              log.info('Auth data:', authData);

              return this._auth.saveCognitoUser(authData).pipe(
                switchMap(auth => [new RouterActions.Go(['/']), new LocalActions.LoginSuccess(auth)]),
                catchError(err => {
                  log.error('Effect: Magic Link Login error', err);

                  return of(new LocalActions.FailureHappened(err));
                })
              );
            })
          );
        })
      );
    })
  );

  // Logout
  @Effect() logout$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LogoutStart>(LocalActions.AuthenticationActionTypes.LOGOUT_START),
    switchMap(() => {
      log.data('Effect: Logout initiated');

      // return from(this._auth.logout()).pipe(
      return from(this._loginService.signOut()).pipe(
        map(() => {
          log.info('Effect: Logout success');

          return new LocalActions.LogoutSuccess();
        }),
        catchError(err => {
          log.error('Effect: Logout error', err);

          return of(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  @Effect() unauthorized$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.Unauthorized>(LocalActions.AuthenticationActionTypes.UNAUTHORIZED),
    switchMap(() =>
      from(this._auth.refreshToken()).pipe(
        map(auth => new LocalActions.LoginSuccess(auth)),
        catchError(err => {
          log.error('Effect: Refresh token error', err);

          return of(new LocalActions.LogoutStart());
        })
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _auth: AuthService,
    private readonly _loginService: PasswordlessLoginService,
    private readonly _socialLoginService: SocialLoginService
  ) {}
}
