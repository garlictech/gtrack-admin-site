import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeDataService } from 'app/shared/services';
import { HikeEditPoiSelectors } from 'app/selectors/hike-edit-poi';
import { State, hikeEditActions, commonHikeActions, commonRouteActions, hikeEditGeneralInfoActions } from '../index';

import * as _ from 'lodash';

@Injectable()
export class HikeEditEffects {
  constructor(private _actions$: Actions, private _store: Store<State>, private _hikeDataService: HikeDataService) {}

<<<<<<< HEAD
  @Effect()
  collectHikeData$: Observable<Action> = this._actions$
    .ofType(hikeEditActions.COLLECT_HIKE_DATA)
    .switchMap(data => {
      return this._hikeDataService
        .collectHikeGeneralInfo()
        .map((generalInfo) => _.extend(_.cloneDeep(data), generalInfo));
    })
    .switchMap(data => {
      return this._hikeDataService
        .collectHikeDescriptions()
        .map((descriptions) => {
          const descriptionObj = {};
          descriptions.map(desc => {
            descriptionObj[desc.id] = _.omit(desc, ['id']);
          });
          return _.extend(_.cloneDeep(data), { description: descriptionObj })
        });
    })
    .switchMap(data => {
      return this._hikeDataService
        .collectHikeRouteInfo()
        .map((routeInfoObj) => _.extend(_.cloneDeep(data), routeInfoObj));
    })
    .switchMap(data => {
      return this._hikeDataService
        .collectHikeStops()
        .map((stopsObj) => _.extend(_.cloneDeep(data), stopsObj));
    })
    .switchMap(data => {
      return this._hikeDataService
        .collectHikeLocation(data)
        .then((locationObj) => _.extend(_.cloneDeep(data), locationObj));
    })
    .map(data => {
      return new commonHikeActions.SaveHikeProgram(
        _.extend(data, {
          routeIcon: 'fake',
          elevationIcon: 'fake' // todo from service
        })
      );
    });
=======
  // @Effect()
  // collectHikeData$: Observable<Action> = this._actions$
  //   .ofType(hikeEditActions.COLLECT_HIKE_DATA)
  //   .switchMap(data => {
  //     return this._hikeDataService.collectHikeGeneralInfo()
  //       .map((generalInfo) => _.extend(_.cloneDeep(data), generalInfo));
  //   })
  //   .switchMap(data => {
  //     return this._hikeDataService.collectHikeDescriptions()
  //       .map((descriptions) => {
  //         const descriptionObj = {};
  //         descriptions.map(desc => {
  //           descriptionObj[desc.id] = _.omit(desc, ['id']);
  //         });
  //         return _.extend(_.cloneDeep(data), { description: descriptionObj })
  //       });
  //   })
  //   .switchMap(data => {
  //     return this._hikeDataService.collectHikeRouteInfo()
  //       .map((routeInfoObj) => _.extend(_.cloneDeep(data), routeInfoObj));
  //   })
  //   .switchMap(data => {
  //     return this._hikeDataService.collectHikeLocation(data)
  //       .then((locationObj) => _.extend(_.cloneDeep(data), locationObj));
  //   })
  //   .map(data => {
  //     return new commonHikeActions.SaveHikeProgram(
  //       _.extend(_.cloneDeep(data), {
  //         routeIcon: 'fake',
  //         elevationIcon: 'fake' // todo from service
  //       })
  //     );
  //   });
>>>>>>> fix: adding multi language component
}
