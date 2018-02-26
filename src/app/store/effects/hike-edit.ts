import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeDataService } from 'app/shared/services';
import { HikeEditPoiSelectors } from 'app/selectors/hike-edit-poi'
import { State, hikeEditActions, commonHikeActions, commonRouteActions, hikeEditGeneralInfoActions } from '../index';

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
      return this._hikeDataService.collectHikeGeneralInfo()
        .map((generalInfo) => _.extend(_.cloneDeep(data), generalInfo));
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikeDescriptions()
        .map((descriptions) => {
          const descriptionObj = {};
          descriptions.map(desc => {
            descriptionObj[desc.id] = _.omit(desc, ['id']);
          });
          return _.extend(_.cloneDeep(data), { description: descriptionObj })
        });
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikeRouteInfo()
        .map((routeInfoObj) => _.extend(_.cloneDeep(data), routeInfoObj));
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikePois()
        .map((poiIds) => _.extend(_.cloneDeep(data), { pois: poiIds }));
    })
    .switchMap(data => {
      return this._hikeDataService.collectHikeLocation()
        .then((locationObj) => {
          return _.extend(_.cloneDeep(data), locationObj)
        });
    })
    .map(data => {
      return new commonHikeActions.SaveHikeProgram(
        _.extend(_.cloneDeep(data), {
          isRoundTrip: false,
          difficulty: 'hard', // todo numeric - range input
          routeIcon: 'fake',
          elevationIcon: 'fake', // todo from service
          stops: [{
            distanceFromOrigo: 0,
            isCheckpoint: false,
            poiId: 'fake',
            lat: 0,
            lon: 0,
            segment: {
              uphill: 0,
              downhill: 0,
              distance: 0,
              score: 0,
              time: 0
            }
          }]
        })
      );
    });
}
