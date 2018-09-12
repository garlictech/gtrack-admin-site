import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as LocalActions from './actions';
import { BackgroundGeolocationService } from '../provider';

import { Injectable } from '@angular/core';

@Injectable()
export class BackgroundGeolocationEffects {
  @Effect({
    dispatch: false
  })
  startTracking$: Observable<void> = this._actions$
    .ofType<LocalActions.StartTracking>(LocalActions.BackgroundGeolocationActionTypes.START_TRACKING)
    .map(() => {
      this._bgl.start();
    });

  @Effect({
    dispatch: false
  })
  endTracking$: Observable<void> = this._actions$
    .ofType<LocalActions.EndTracking>(LocalActions.BackgroundGeolocationActionTypes.END_TRACKING)
    .map(() => {
      this._bgl.end();
    });

  constructor(private _bgl: BackgroundGeolocationService, private _actions$: Actions) {}
}
