import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeDataService } from 'app/shared/services';
import { HikeEditPoiSelectors } from 'app/selectors/hike-edit-poi'
import { State, hikeEditActions, commonHikeActions } from '../index';

import * as _ from 'lodash';

@Injectable()
export class HikeEditEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<State>,
    private _hikeDataService: HikeDataService
  ) {}

  @Effect()
  collectHikeData$: Observable<Action> = this._actions$
    .ofType(hikeEditActions.COLLECT_HIKE_DATA)
    .map(toPayload)
    .switchMap(data => {
      return this._hikeDataService.collectHikeDescriptions()
        .map((descriptions) => {
          return _.extend(_.cloneDeep(data), { descriptions: descriptions });
        });
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikeRouteInfo()
        .map((routeInfo) => {
          return _.extend(_.cloneDeep(data), routeInfo);
        });
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikePois()
        .map((poiIds) => {
          return _.extend(_.cloneDeep(data), { pois: poiIds });
        });
    })
    .map(data => {
      return new commonHikeActions.CreateHikeProgram(data);
    });
}
