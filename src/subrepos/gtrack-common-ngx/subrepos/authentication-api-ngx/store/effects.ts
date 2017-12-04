import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth';
import { TwitterService } from '../twitter';
import { FacebookService } from '../facebook';
import { GoogleService } from '../google';
import { PasswordlessService } from '../passwordless';
import { log } from '../log';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  // Twitter login
  @Effect()
  twitterLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.TWITTER_LOGIN)
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Twitter login initiated');
      return Observable.fromPromise(this._twitter.connect(payload))
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
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Requesting Twitter email verification token');
      return Observable.fromPromise(this._auth.requestVerifyToken(payload))
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
  verify$: Observable<Action> = this._actions$.ofType(LocalActions.VERIFY).map(toPayload).switchMap(payload => {
    log.d('Effect: Verify initiated');
    return Observable.fromPromise(this._auth.verify(payload.token, payload.uid))
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
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Google login initiated');
      return Observable.fromPromise(this._google.connect(payload))
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
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Facebook login initiated');
      return Observable.fromPromise(this._facebook.connect(payload))
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
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Magic Link login initiated');
      return this._magicLink
        .requestToken(payload.email, payload.language, payload.roles)
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
    .map(toPayload)
    .switchMap(payload => {
      log.d('Effect: Magic Link login initiated');
      return Observable.fromPromise(this._magicLink.callback(payload.token, payload.uid, payload.roles))
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
  logout$: Observable<Action> = this._actions$.ofType(LocalActions.LOGOUT_START).map(toPayload).switchMap(() => {
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
  unauthorized$: Observable<Action> = this._actions$.ofType(LocalActions.UNAUTHORIZED).map(toPayload).switchMap(() => {
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
  ) {}
}
