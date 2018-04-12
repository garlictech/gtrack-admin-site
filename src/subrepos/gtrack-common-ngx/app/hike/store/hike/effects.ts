import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';

import { HikeProgramService } from '../../services/hike-program';
import { IHikeProgram } from 'subrepos/provider-client';
import * as LocalActions from './actions';
import * as PoiActions from '../poi/actions';

@Injectable()
export class HikeEffects {
  @Effect()
  loadHike$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadHikeProgram>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM)
    .mergeMap(action => {
<<<<<<< HEAD
      return this._hikeProgramService
        .get(action.context)
        .take(1)
        .map(hike => {
          if (hike !== null) {
            return new LocalActions.HikeProgramLoaded(action.context, hike);
          }

          return new LocalActions.LoadHikeProgramFailed(action.context);
        });
    });

    @Effect()
    loadHikes$: Observable<Action> = this._actions$
      .ofType<LocalActions.LoadHikePrograms>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS)
      .mergeMap(action => {
        return this._hikeProgramService
          .query()
          .take(1)
          .map(hikePrograms => {
            let ids = hikePrograms.map(hikeProgram => hikeProgram.id);

            return new LocalActions.AllHikeProgramsLoaded(ids, hikePrograms);
          });
=======
      return this._hikeProgramService.get(action.context).map(hike => {
        if (hike !== null) {
          return new LocalActions.HikeProgramLoaded(action.context, hike);
        }

        return new LocalActions.LoadHikeProgramFailed(action.context);
>>>>>>> fix: adding multi language component
      });
    });

<<<<<<< HEAD
    @Effect()
    saveHike$: Observable<Action> = this._actions$
      .ofType<LocalActions.SaveHikeProgram>(LocalActions.HikeProgramActionTypes.SAVE_HIKE_PROGRAM)
      .mergeMap(action => {
        return this._hikeProgramService
          .create(action.hikeProgram)
          .take(1)
          .map(response => new LocalActions.HikeProgramSaved(response.id));
=======
  @Effect()
  loadHikes$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadHikePrograms>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAMS)
    .mergeMap(action => {
      return this._hikeProgramService.query().map(hikePrograms => {
        let ids = hikePrograms.map(hikeProgram => hikeProgram.id);
        return new LocalActions.AllHikeProgramsLoaded(ids, hikePrograms);
>>>>>>> fix: adding multi language component
      });
    });

  constructor(private _actions$: Actions, private _hikeProgramService: HikeProgramService, private _store: Store<any>) {
    /* EMPTY */
  }
}
