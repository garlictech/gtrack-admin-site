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
import { empty } from 'rxjs/Observer';

@Injectable()
export class HikeEffects {
  @Effect()
  loadHike$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadHikeProgram>(LocalActions.HikeProgramActionTypes.LOAD_HIKE_PROGRAM)
    .mergeMap(action => {
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
          let _hikePrograms = hikePrograms.filter(hikeProgram => hikeProgram.id);
          let ids = _hikePrograms.map(hikeProgram => hikeProgram.id);
          return new LocalActions.AllHikeProgramsLoaded(ids, _hikePrograms);
        });
    });

  @Effect()
  updateState$: Observable<Action> = this._actions$
    .ofType<LocalActions.UpdateHikeProgramState>(LocalActions.HikeProgramActionTypes.UPDATE_HIKE_PROGRAM_STATE)
    .mergeMap(action => {
      return this._hikeProgramService
        .updateState(action.id, action.state)
        .take(1)
        .map(result => {
          return new LocalActions.LoadHikeProgram(action.id);
        });
    });

  @Effect()
  deleteHike$: Observable<Action> = this._actions$
    .ofType<LocalActions.UpdateHikeProgramState>(LocalActions.HikeProgramActionTypes.DELETE_HIKE_PROGRAM)
    .mergeMap(action => {
      return this._hikeProgramService
        .delete(action.id)
        .take(1)
        .map(result => {
          return new LocalActions.HikeProgramDeleted(action.id);
        });
    });

  constructor(private _actions$: Actions, private _hikeProgramService: HikeProgramService, private _store: Store<any>) {}
}
