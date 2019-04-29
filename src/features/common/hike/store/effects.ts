// tslint:disable:no-property-initializers
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { HikeProgramService } from '../services/hike-program';
import * as LocalActions from './actions';
import { HikeSelectors } from './selectors';

@Injectable()
export class HikeEffects {
  @Effect() loadHike$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadHikeProgram>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM),
    mergeMap(action =>
      this._hikeProgramService.get(action.context).pipe(
        take(1),
        map(hike => {
          if (hike !== null) {
            return new LocalActions.HikeProgramLoaded(action.context, hike);
          }

          return new LocalActions.LoadHikeProgramFailed(action.context);
        })
      )
    )
  );

  @Effect() reverseHike$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.ReverseHikeProgram>(LocalActions.HikeProgramActionTypes.REVERSE_HIKE_PROGRAM),
    mergeMap(action =>
      this._store.pipe(
        select(this._selectors.getHike(action.context)),
        map(hikeProgram => this._hikeProgramService.reverse(hikeProgram)),
        take(1),
        map(hike => new LocalActions.HikeProgramReversed(action.context, hike))
      )
    )
  );

  @Effect() loadHikes$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadHikePrograms>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS),
    mergeMap(action =>
      this._hikeProgramService.query().pipe(
        take(1),
        map(hikePrograms => {
          const ids = hikePrograms.map(hikeProgram => hikeProgram.id);

          return new LocalActions.AllHikeProgramsLoaded(ids, hikePrograms);
        })
      )
    )
  );

  @Effect() updateState$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.UpdateHikeProgramState>(LocalActions.HikeProgramActionTypes.UPDATE_HIKE_PROGRAM_STATE),
    mergeMap(action =>
      this._hikeProgramService.updateState(action.id, action.state).pipe(
        take(1),
        map(result => new LocalActions.LoadHikeProgram(action.id))
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _selectors: HikeSelectors,
    private readonly _store: Store<any>
  ) {}
}
