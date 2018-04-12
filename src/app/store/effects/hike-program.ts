import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import * as HikeProgramActions from '../actions/hike-program';
import { selectData } from '../selectors/hike-program';
import { HikeProgramService } from 'subrepos/gtrack-common-ngx';
import { State } from 'app/store';
import { IHikeProgram } from 'subrepos/provider-client';
import { log } from 'app/log';

@Injectable()
export class HikeProgramEffects {
  constructor(
    private _actions$: Actions,
    private _hikeProgramService: HikeProgramService,
    private _store: Store<State>
  ) {
    /* EMPTY */
  }

  @Effect()
  save$: Observable<Action> = this._actions$
    .ofType(HikeProgramActions.SAVE)
    .switchMap(() => this._store.select(selectData).take(1))
    .switchMap((data: IHikeProgram) =>
      this._hikeProgramService
        .save(data)
        .take(1)
        .map(() => new HikeProgramActions.SaveSuccess())
        .catch(error => {
          log.er('Effect: Hike program save error: ', error);
          return Observable.of(new HikeProgramActions.SaveFailed(error));
        })
    );
}
