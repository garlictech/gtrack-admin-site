import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeProgramService } from 'subrepos/gtrack-common-ngx';
import { State, editedHikeProgramActions } from 'app/store';
import { IHikeProgram } from 'subrepos/provider-client';
import { log } from 'app/log';

import { EditedHikeProgramSelectors } from '../selectors/edited-hike-program';

@Injectable()
export class HikeProgramEffects {
  constructor(
    private _actions$: Actions,
    private _hikeProgramService: HikeProgramService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _store: Store<State>
  ) {
    /* EMPTY */
  }

  @Effect()
  save$: Observable<Action> = this._actions$
    .ofType(editedHikeProgramActions.SAVE_HIKE_PROGRAM)
    .switchMap(() => this._store.select(this._editedHikeProgramSelectors.getData).take(1))
    .switchMap((data: IHikeProgram) =>
      this._hikeProgramService
        .save(data)
        .take(1)
        .map(() => new editedHikeProgramActions.HikeProgramSaveSuccess())
        .catch(error => {
          log.er('Effect: Hike program save error: ', error);
          return Observable.of(new editedHikeProgramActions.HikeProgramSaveFailed(error));
        })
    );
}
