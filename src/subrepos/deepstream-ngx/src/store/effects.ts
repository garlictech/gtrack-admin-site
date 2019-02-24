import { Observable, of as observableOf } from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { IClientData } from '@garlictech/deepstream-rxjs';

import { DeepstreamService } from '../deepstream-service';
import { log } from '../log';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  @Effect() deepstreamLogin$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.DeepstreamLogin>(LocalActions.DEEPSTREAM_LOGIN),
    mergeMap(action => {
      log.data('Effect: Logging in to deepstream...');
      return this._deepstreamService.login(action.token);
    }),
    filter(auth => !!auth),
    map((auth: IClientData) => {
      log.info('Effect: Deepstream auth success. Auth objct: ', auth);
      return new LocalActions.DeepstreamAuthSuccess(auth);
    }),
    catchError(err => {
      log.error('Effect: Deepstream auth error', err);
      return observableOf(new LocalActions.DeepstreamLoginFailed(err));
    })
  );

  constructor(private readonly _actions$: Actions, private readonly _deepstreamService: DeepstreamService) {}
}
