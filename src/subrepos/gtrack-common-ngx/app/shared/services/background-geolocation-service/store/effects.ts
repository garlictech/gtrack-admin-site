import { map } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';

import * as LocalActions from './actions';
import { BackgroundGeolocationService } from '../provider';

import { Injectable } from '@angular/core';

@Injectable()
export class BackgroundGeolocationEffects {
  @Effect({
    dispatch: false
  })
<<<<<<< HEAD
  startTracking$: Observable<void> = this._actions$.pipe(
    ofType<LocalActions.StartTracking>(LocalActions.BackgroundGeolocationActionTypes.START_TRACKING),
    map(() => {
      this._bgl.start();
    })
  );
=======
  startTracking$: Observable<void> = this._actions$
    .pipe(
      ofType<LocalActions.StartTracking>(LocalActions.BackgroundGeolocationActionTypes.START_TRACKING),
      map(() => {
        this._bgl.start();
      })
    );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

  @Effect({
    dispatch: false
  })
<<<<<<< HEAD
  endTracking$: Observable<void> = this._actions$.pipe(
    ofType<LocalActions.EndTracking>(LocalActions.BackgroundGeolocationActionTypes.END_TRACKING),
    map(() => {
      this._bgl.end();
    })
  );
=======
  endTracking$: Observable<void> = this._actions$
    .pipe(
      ofType<LocalActions.EndTracking>(LocalActions.BackgroundGeolocationActionTypes.END_TRACKING),
      map(() => {
        this._bgl.end();
      })
    );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

  constructor(private _bgl: BackgroundGeolocationService, private _actions$: Actions) {}
}
