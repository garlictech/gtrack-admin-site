import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs-compat/Observable';
import 'rxjs/add/operator/mergeMap';

import { GeoSearchService } from '../services/geosearch.service';
import * as LocalActions from './actions';

@Injectable()
export class GeoSearchEffects {
  @Effect()
  searchInBox$: Observable<Action> = this._actions$
    .ofType<LocalActions.SearchInBox>(LocalActions.GeoSearchActionTypes.SEARCH_IN_BOX)
    .mergeMap(action => {
      return this._geoSearchService.searchBox(action.query).map(results => {
        return new LocalActions.GeoSearchComplete(results, action.context);
      });
    });

  @Effect()
  searchInCircle$: Observable<Action> = this._actions$
    .ofType<LocalActions.SearchInCircle>(LocalActions.GeoSearchActionTypes.SEARCH_IN_CIRCLE)
    .mergeMap(action => {
      return this._geoSearchService.searchCircle(action.query).map(results => {
        return new LocalActions.GeoSearchComplete(results, action.context);
      });
    });

  constructor(private _actions$: Actions, private _geoSearchService: GeoSearchService, private _store: Store<any>) {}
}
