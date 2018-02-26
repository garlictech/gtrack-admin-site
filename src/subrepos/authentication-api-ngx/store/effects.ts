import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth';
import { TwitterService } from '../twitter';
import { FacebookService } from '../facebook';
import { GoogleService } from '../google';
import { PasswordlessService } from '../passwordless';
import { log } from '../log';
import * as LocalActions from './actions';
import { LoginError, LoginErrorCodes } from '../errors/login-error';

@Injectable()
export class Effects {
  // Twitter login
  @Effect()
  twitterLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.TWITTER_LOGIN)
    .switchMap((action: LocalActions.TwitterLogin) => {
      log.d('Effect: Twitter login initiated');
      return Observable.fromPromise(this._twitter.connect(action.payload))
        .map(auth => {
          log.i('Effect: Twitter login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.er('Effect: Twitter Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Twitter token verification
  @Effect()
  requestVerifyToken$: Observable<Action> = this._actions$
    .ofType(LocalActions.REQUEST_VERIFY_TOKEN)
    .switchMap((action: LocalActions.RequestVerifyToken) => {
      log.d('Effect: Requesting Twitter email verification token');
      return Observable.fromPromise(this._auth.requestVerifyToken(action.payload))
        .map(auth => {
          log.i('Effect: Twitter verification email sent');
          return new LocalActions.MagicLinkEmailSent();
        })
        .catch(err => {
          log.er('Effect: Twitter Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Verify
  @Effect()
  verify$: Observable<Action> = this._actions$.ofType(LocalActions.VERIFY).switchMap((action: LocalActions.Verify) => {
    log.d('Effect: Verify initiated');
    return Observable.fromPromise(this._auth.verify(action.payload.token, action.payload.uid))
      .map(auth => {
        log.i('Effect: Verify success');
        return new LocalActions.LoginSuccess(auth);
      })
      .catch(err => {
        log.er('Effect: Verify error', err);
        return Observable.of(new LocalActions.FailureHappened(err));
      });
  });

  // Google login
  @Effect()
  googleLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.GOOGLE_LOGIN)
    .switchMap((action: LocalActions.GoogleLogin) => {
      log.d('Effect: Google login initiated');
      return Observable.fromPromise(this._google.connect(action.payload))
        .map(auth => {
          log.i('Effect: Google login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.er('Effect: Google Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Facebook login
  @Effect()
  facebookLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.FACEBOOK_LOGIN)
    .switchMap((action: LocalActions.FacebookLogin) => {
      log.d('Effect: Facebook login initiated');
      return Observable.fromPromise(this._facebook.connect(action.payload))
        .map(auth => {
          log.i('Effect: Facebook login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.er('Effect: Facebook Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Magic Link login
  @Effect()
  magiclinkRequestToken$: Observable<Action> = this._actions$
    .ofType(LocalActions.MAGICLINK_REQUEST_TOKEN)
    .switchMap((action: LocalActions.RequestMagicLinkToken) => {
      log.d('Effect: Magic Link login initiated');
      return this._magicLink
        .requestToken(action.payload.email, action.payload.language, action.payload.roles)
        .map(() => {
          log.i('Effect: Magic Link email sent');
          return new LocalActions.MagicLinkEmailSent();
        })
        .catch(err => {
          log.er('Effect: Magic Link email sending', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Magic Link login
  @Effect()
  magiclinkLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.MAGICLINK_LOGIN)
    .switchMap((action: LocalActions.MagicLinkLogin) => {
      log.d('Effect: Magic Link login initiated');
      return Observable.fromPromise(this._magicLink.callback(action.payload.token, action.payload.uid, action.payload.roles))
        .map(auth => {
          log.i('Effect: Magic Link login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.er('Effect: Magic Link Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Logout
  @Effect()
  logout$: Observable<Action> = this._actions$.ofType(LocalActions.LOGOUT_START)
    .switchMap(() => {
      log.d('Effect: Logout initiated');
      return Observable.fromPromise(this._auth.logout())
        .map(() => {
          log.i('Effect: Logout success');
          return new LocalActions.LogoutSuccess();
        })
        .catch(err => {
          log.er('Effect: Logout error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  @Effect()
  unauthorized$: Observable<Action> = this._actions$.ofType(LocalActions.UNAUTHORIZED).switchMap(() => {
    return Observable.fromPromise(this._auth.refreshToken())
      .map(auth => {
        return new LocalActions.LoginSuccess(auth);
      })
      .catch(err => {
        log.er('Effect: Refresh token error', err);
        return Observable.of(new LocalActions.LogoutStart());
      });
  });

  constructor(
    private _actions$: Actions,
    private _twitter: TwitterService,
    private _google: GoogleService,
    private _facebook: FacebookService,
    private _magicLink: PasswordlessService,
    private _auth: AuthService
  ) { }
}
