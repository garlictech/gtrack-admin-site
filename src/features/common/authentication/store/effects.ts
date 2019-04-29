// tslint:disable:no-property-initializers no-identical-functions
import { from, from as observableFrom, Observable, of as observableOf } from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '@bit/garlictech.angular-features.common.authentication-api/auth';
import {
  FacebookLoginService,
  GoogleLoginService,
  PasswordlessLoginService
} from '@bit/garlictech.angular-features.common.authentication-cognito';
import { log } from '../log';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  // Twitter login
  // @Effect() twitterLogin$: Observable<Action> = this._actions$.pipe(
  //   ofType<LocalActions.TwitterLogin>(LocalActions.AuthenticationActionTypes.TWITTER_LOGIN),
  //   switchMap(action => {
  //     log.data('Effect: Twitter login initiated');

  //     return observableFrom(this._twitter.connect(action.roles)).pipe(
  //       map(auth => {
  //         log.info('Effect: Twitter login success');

  //         return new LocalActions.LoginSuccess(auth);
  //       }),
  //       catchError(err => {
  //         log.error('Effect: Twitter Login error', err);

  //         return observableOf(new LocalActions.FailureHappened(err));
  //       })
  //     );
  //   })
  // );

  // Twitter token verification
  // @Effect() requestVerifyToken$: Observable<Action> = this._actions$.pipe(
  //   ofType<LocalActions.RequestVerifyToken>(LocalActions.AuthenticationActionTypes.REQUEST_VERIFY_TOKEN),
  //   switchMap(action => {
  //     log.data('Effect: Requesting Twitter email verification token');

  //     return observableFrom(this._auth.requestVerifyToken(action.email)).pipe(
  //       map(() => {
  //         log.info('Effect: Twitter verification email sent');

  //         return new LocalActions.MagicLinkEmailSent();
  //       }),
  //       catchError(err => {
  //         log.error('Effect: Twitter Login error', err);

  //         return observableOf(new LocalActions.FailureHappened(err));
  //       })
  //     );
  //   })
  // );

  // Verify
  @Effect() verify$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.Verify>(LocalActions.AuthenticationActionTypes.VERIFY),
    switchMap(action => {
      log.data('Effect: Verify initiated');

      return observableFrom(this._auth.verify(action.token, action.uid)).pipe(
        map(auth => {
          log.info('Effect: Verify success');

          return new LocalActions.LoginSuccess(auth);
        }),
        catchError(err => {
          log.error('Effect: Verify error', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Google login
  @Effect() googleLogin$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.GoogleLogin>(LocalActions.AuthenticationActionTypes.GOOGLE_LOGIN),
    switchMap(action => {
      log.data('Effect: Google login initiated');

      return from(this._googleService.connect(action.roles)).pipe(
        map(auth => {
          log.info('Effect: Google login success');

          return new LocalActions.LoginSuccess(undefined);
        }),
        catchError(err => {
          log.error('Effect: Google Login error', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Facebook login
  @Effect() facebookLogin$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.FacebookLogin>(LocalActions.AuthenticationActionTypes.FACEBOOK_LOGIN),
    switchMap(action => {
      log.data('Effect: Facebook login initiated');

      // return observableFrom(this._facebook.connect(action.roles)).pipe(
      //   map(auth => {
      //     log.info('Effect: Facebook login success');

      //     return new LocalActions.LoginSuccess(auth);
      //   }),
      //   catchError(err => {
      //     log.error('Effect: Facebook Login error', err);

      //     return observableOf(new LocalActions.FailureHappened(err));
      //   })
      // );

      return from(this._facebookService.connect(action.roles)).pipe(
        map(auth => {
          log.info('Effect: Facebook login success');

          return new LocalActions.LoginSuccess(undefined);
        }),
        catchError(err => {
          log.error('Effect: Facebook Login error', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Magic Link login
  @Effect() magiclinkRequestToken$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.RequestMagicLinkToken>(LocalActions.AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN),
    switchMap(action => {
      log.data('Effect: Magic Link login initiated');

      // return this._magicLink.requestToken(action.email, action.language, action.roles).pipe(
      //   map(() => {
      //     log.info('Effect: Magic Link email sent');

      //     return new LocalActions.MagicLinkEmailSent();
      //   }),
      //   catchError(err => {
      //     log.error('Effect: Magic Link email sending', err);

      //     return observableOf(new LocalActions.FailureHappened(err));
      //   })

      // return from(this._loginService.signUp(action.email)).pipe(
      //   switchMapTo(from(this._loginService.signIn(action.email))),
      //   map(() => {
      //     log.info('Effect: Magic Link email sent');

      //     return new LocalActions.MagicLinkEmailSent();
      //   }),
      //   catchError(err => {
      //     log.error('Effect: Magic Link email sending', err);

      //     return observableOf(new LocalActions.FailureHappened(err));
      //   })
      // );

      return from(this._loginService.signIn(action.email)).pipe(
        map(() => {
          log.info('Effect: Magic Link email sent');

          return new LocalActions.MagicLinkEmailSent();
        }),
        catchError(err => {
          log.error('Effect: Magic Link email sending', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Magic Link login
  @Effect() magiclinkLogin$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.MagicLinkLogin>(LocalActions.AuthenticationActionTypes.MAGICLINK_LOGIN),
    switchMap(action => {
      log.data('Effect: Magic Link login initiated');

      // return observableFrom(this._magicLink.callback(action.token, action.uid, action.roles)).pipe(
      //   map(auth => {
      //     log.info('Effect: Magic Link login success');

      //     return new LocalActions.LoginSuccess(auth);
      //   }),
      //   catchError(err => {
      //     log.error('Effect: Magic Link Login error', err);

      //     return observableOf(new LocalActions.FailureHappened(err));
      //   })
      // );
      return from(this._loginService.answerCustomChallenge(action.token)).pipe(
        map(auth => {
          log.info('Effect: Magic Link login success');
          log.data('Auth:', auth);

          return new LocalActions.LoginSuccess(undefined);
        }),
        catchError(err => {
          log.error('Effect: Magic Link Login error', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  // Logout
  @Effect() logout$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LogoutStart>(LocalActions.AuthenticationActionTypes.LOGOUT_START),
    switchMap(() => {
      log.data('Effect: Logout initiated');

      return observableFrom(this._auth.logout()).pipe(
        map(() => {
          log.info('Effect: Logout success');

          return new LocalActions.LogoutSuccess();
        }),
        catchError(err => {
          log.error('Effect: Logout error', err);

          return observableOf(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  @Effect() unauthorized$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.Unauthorized>(LocalActions.AuthenticationActionTypes.UNAUTHORIZED),
    switchMap(() =>
      observableFrom(this._auth.refreshToken()).pipe(
        map(auth => new LocalActions.LoginSuccess(auth)),
        catchError(err => {
          log.error('Effect: Refresh token error', err);

          return observableOf(new LocalActions.LogoutStart());
        })
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _auth: AuthService,
    private readonly _loginService: PasswordlessLoginService,
    private readonly _googleService: GoogleLoginService,
    private readonly _facebookService: FacebookLoginService
  ) {}
}
