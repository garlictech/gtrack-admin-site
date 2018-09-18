<<<<<<< HEAD
import { of as observableOf, Observable } from 'rxjs';
=======
import { of as observableOf,  Observable } from 'rxjs';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import { catchError, map, filter, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { IClientData } from '@garlictech/deepstream-rxjs';

import { log } from '../log';
import { DeepstreamService } from '../deepstream-service';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  @Effect()
<<<<<<< HEAD
  deepstreamLogin$: Observable<Action> = this._actions$.pipe(
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

  constructor(private _actions$: Actions, private _deepstreamService: DeepstreamService) {}
=======
  deepstreamLogin$: Observable<Action> = this._actions$
    .pipe(
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

  constructor(
    private _actions$: Actions,
    private _deepstreamService: DeepstreamService
  ) {}
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
}
