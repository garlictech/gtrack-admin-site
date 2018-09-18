import { map, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs-compat/Observable';

import { HikeProgramService } from '../../services/hike-program';
import * as LocalActions from './actions';

@Injectable()
export class HikeEffects {
  @Effect()
  loadHike$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadHikeProgram>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM),
    mergeMap(action => {
      return this._hikeProgramService.get(action.context).pipe(
        take(1),
        map(hike => {
          if (hike !== null) {
            return new LocalActions.HikeProgramLoaded(action.context, hike);
          }

          return new LocalActions.LoadHikeProgramFailed(action.context);
        })
      );
    })
  );

  @Effect()
  loadHikes$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadHikePrograms>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS),
    mergeMap(action => {
      return this._hikeProgramService.query().pipe(
        take(1),
        map(hikePrograms => {
          const ids = hikePrograms.map(hikeProgram => hikeProgram.id);

          return new LocalActions.AllHikeProgramsLoaded(ids, hikePrograms);
        })
      );
    })
  );

  @Effect()
  updateState$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.UpdateHikeProgramState>(LocalActions.HikeProgramActionTypes.UPDATE_HIKE_PROGRAM_STATE),
    mergeMap(action => {
      return this._hikeProgramService.updateState(action.id, action.state).pipe(
        take(1),
        map(result => {
          return new LocalActions.LoadHikeProgram(action.id);
        })
      );
    })
  );

  constructor(private _actions$: Actions, private _hikeProgramService: HikeProgramService) {}
}
