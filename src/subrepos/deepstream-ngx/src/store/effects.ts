import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { IClientData } from '@garlictech/deepstream-rxjs';

import { log } from '../log';
// import { Actions as JwtApiActions, IAuth } from 'authentication-api-ngx';
import { DeepstreamService } from '../deepstream-service';
import * as LocalActions from './actions';
import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';

interface IAuth {
  token: string;
}

@Injectable()
export class Effects {
  @Effect()
  deepstreamLogin$: Observable<Action> = this._actions$
    .ofType(LocalActions.DEEPSTREAM_LOGIN)
    .map(toPayload)
    .switchMap((token: string) => {
      log.d('Effect: Logging in to deepstream...');
      return this._deepstreamService.login(token);
    })
    .filter(auth => !!auth)
    .map((auth: IClientData) => {
      log.i('Effect: Deepstream auth success. Auth objct: ', auth);
      return new LocalActions.DeepstreamAuthSuccess(auth);
    })
    .catch(err => {
      log.er('Effect: Deepstream auth error', err);
      return Observable.of(new LocalActions.DeepstreamLoginFailed(err));
    });

  @Effect()
  deepstreamLoginAfterJwtLogin$: Observable<Action> = this._actions$
    .ofType(this._externals.JwtApiActions.LOGIN_SUCCESS)
    .map(toPayload)
    .map((auth: IAuth) => {
      log.d('Effect: Initiating deepstream login');
      return new LocalActions.DeepstreamLogin(auth.token);
    })
    .catch(err => {
      log.er('Effect: Deepstream Login error', err);
      return Observable.of(new LocalActions.DeepstreamLoginFailed(err));
    });

  @Effect()
  deepstreamLogoutAfterJwtLogout$: Observable<Action> = this._actions$
    .ofType(this._externals.JwtApiActions.LOGOUT_START)
    .map(toPayload)
    .switchMap(() => {
      log.d('Effect: Initiating deepstream logout');
      return this._deepstreamService.getClient().close();
    })
    .switchMap(() => this._deepstreamService.getClient().login({ jwtToken: null }))
    .map(() => {
      log.i('Effect: Deepstream logout success');
      return new LocalActions.DeepstreamLogoutSuccess();
    });

  @Effect()
  deepstreamPermissionRecord$: Observable<Action> = this._actions$
    .ofType(LocalActions.DEEPSTREAM_AUTH_SUCCESS)
    .map(toPayload)
    .switchMap((auth: IClientData) => {
      log.d('Effect: Subscribing to the permission record');
      let res$ = Observable.of({});

      if (auth.permissionRecord) {
        let record = this._deepstreamService.getRecord(auth.permissionRecord);
        res$ = record.get();
      }

      return res$
        .map(permissionRecord => {
          log.i('Effect: Deepstream permission record changed');
          return new LocalActions.DeepstreamPermissionRecordChanged(permissionRecord);
        })
        .catch((err, caught) => {
          log.er('Effect: Deepstream permission record error', err);
          return caught;
        });
    });

  constructor(
    private _actions$: Actions,
    private _deepstreamService: DeepstreamService,
    private _store: Store<any>,
    @Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private _externals: IExternalDeepstreamDependencies
  ) {
    /* EMPTY */
  }
}
