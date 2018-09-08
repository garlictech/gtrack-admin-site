import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

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
    .ofType<LocalActions.TwitterLogin>(LocalActions.TWITTER_LOGIN)
    .switchMap(action => {
      log.data('Effect: Twitter login initiated');
      return Observable.fromPromise(this._twitter.connect(action.roles))
        .map(auth => {
          log.info('Effect: Twitter login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.error('Effect: Twitter Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Twitter token verification
  @Effect()
  requestVerifyToken$: Observable<Action> = this._actions$
    .ofType<LocalActions.RequestVerifyToken>(LocalActions.REQUEST_VERIFY_TOKEN)
    .switchMap(action => {
      log.data('Effect: Requesting Twitter email verification token');
      return Observable.fromPromise(this._auth.requestVerifyToken(action.email))
        .map(auth => {
          log.info('Effect: Twitter verification email sent');
          return new LocalActions.MagicLinkEmailSent();
        })
        .catch(err => {
          log.error('Effect: Twitter Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Verify
  @Effect()
  verify$: Observable<Action> = this._actions$.ofType<LocalActions.Verify>(LocalActions.VERIFY).switchMap(action => {
    log.data('Effect: Verify initiated');
    return Observable.fromPromise(this._auth.verify(action.token, action.uid))
      .map(auth => {
        log.info('Effect: Verify success');
        return new LocalActions.LoginSuccess(auth);
      })
      .catch(err => {
        log.error('Effect: Verify error', err);
        return Observable.of(new LocalActions.FailureHappened(err));
      });
  });

  // Google login
  @Effect()
  googleLogin$: Observable<Action> = this._actions$
    .ofType<LocalActions.GoogleLogin>(LocalActions.GOOGLE_LOGIN)
    .switchMap(action => {
      log.data('Effect: Google login initiated');
      return Observable.fromPromise(this._google.connect(action.roles))
        .map(auth => {
          log.info('Effect: Google login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.error('Effect: Google Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Facebook login
  @Effect()
  facebookLogin$: Observable<Action> = this._actions$
    .ofType<LocalActions.FacebookLogin>(LocalActions.FACEBOOK_LOGIN)
    .switchMap(action => {
      log.data('Effect: Facebook login initiated');
      return Observable.fromPromise(this._facebook.connect(action.roles))
        .map(auth => {
          log.info('Effect: Facebook login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.error('Effect: Facebook Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Magic Link login
  @Effect()
  magiclinkRequestToken$: Observable<Action> = this._actions$
    .ofType<LocalActions.RequestMagicLinkToken>(LocalActions.MAGICLINK_REQUEST_TOKEN)
    .switchMap(action => {
      log.data('Effect: Magic Link login initiated');
      return this._magicLink
        .requestToken(action.email, action.language, action.roles)
        .map(() => {
          log.info('Effect: Magic Link email sent');
          return new LocalActions.MagicLinkEmailSent();
        })
        .catch(err => {
          log.error('Effect: Magic Link email sending', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Magic Link login
  @Effect()
  magiclinkLogin$: Observable<Action> = this._actions$
    .ofType<LocalActions.MagicLinkLogin>(LocalActions.MAGICLINK_LOGIN)
    .switchMap(action => {
      log.data('Effect: Magic Link login initiated');
      return Observable.fromPromise(this._magicLink.callback(action.token, action.uid, action.roles))
        .map(auth => {
          log.info('Effect: Magic Link login success');
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.error('Effect: Magic Link Login error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  // Logout
  @Effect()
  logout$: Observable<Action> = this._actions$
    .ofType<LocalActions.LogoutStart>(LocalActions.LOGOUT_START)
    .switchMap(() => {
      log.data('Effect: Logout initiated');
      return Observable.fromPromise(this._auth.logout())
        .map(() => {
          log.info('Effect: Logout success');
          return new LocalActions.LogoutSuccess();
        })
        .catch(err => {
          log.error('Effect: Logout error', err);
          return Observable.of(new LocalActions.FailureHappened(err));
        });
    });

  @Effect()
  unauthorized$: Observable<Action> = this._actions$
    .ofType<LocalActions.Unauthorized>(LocalActions.UNAUTHORIZED)
    .switchMap(() => {
      return Observable.fromPromise(this._auth.refreshToken())
        .map(auth => {
          return new LocalActions.LoginSuccess(auth);
        })
        .catch(err => {
          log.error('Effect: Refresh token error', err);
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
  ) {}
}
