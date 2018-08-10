import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PoiService } from 'subrepos/gtrack-common-ngx';
import { State, editedGTrackPoiActions } from '..';
import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { log } from '../../log';

import * as _ from 'lodash';
import { EditedGTrackPoiSelectors } from '../selectors';

@Injectable()
export class EditedGTrackPoiEffects {
  constructor(
    private _actions$: Actions,
    private _poiService: PoiService,
    private _editedGTrackPoiSelectors: EditedGTrackPoiSelectors,
    private _store: Store<State>
  ) {}

  @Effect()
  save$: Observable<Action> = this._actions$
    .ofType(editedGTrackPoiActions.SAVE_POI)
    .switchMap(() => this._store.select(this._editedGTrackPoiSelectors.getData).take(1))
    .switchMap((data: IPoiStored) => {
      const poiData = _.omit(data, ['timestamp']);

      return this._poiService
        .create(<IPoi>poiData)
        .take(1)
        .map((poi) => new editedGTrackPoiActions.PoiSaveSuccess(poi.id))
        .catch(error => {
          log.er('Effect: Poi save error: ', error);
          return Observable.of(new editedGTrackPoiActions.PoiSaveFailed(error));
        });
    });
}
