import { Injectable, Inject } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
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
    .ofType<LocalActions.DeepstreamLogin>(LocalActions.DEEPSTREAM_LOGIN)
    .mergeMap(action => {
      log.d('Effect: Logging in to deepstream...');
      return this._deepstreamService.login(action.token);
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

  constructor(
    private _actions$: Actions,
    private _deepstreamService: DeepstreamService,
    private _store: Store<any>,
    @Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private _externals: IExternalDeepstreamDependencies
  ) {}
}
