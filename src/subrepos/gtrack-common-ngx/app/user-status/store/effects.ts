import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import { LocationService } from '../services/location.service';
import * as LocalActions from './actions';

@Injectable()
export class UserStatusEffects {
  @Effect()
  requestLocation$: Observable<Action> = this._actions$
  .ofType<LocalActions.RequestLocation>(LocalActions.UserStatusActionTypes.REQUEST_LOCATION)
  .mergeMap(action => {
    return this._locationService
      .requestLocation()
      .map(location => {
        return new LocalActions.LocationRequested(location);
      })
      .catch(err => Observable.of(new LocalActions.RequestLocationFailed(err)));
  });

  constructor(
    private _actions$: Actions,
    private _locationService: LocationService,
    private _store: Store<any>
  ) {}
};
