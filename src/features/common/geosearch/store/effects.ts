// tslint:disable:no-property-initializers
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { GeoSearchService } from '../services/geosearch.service';
import * as LocalActions from './actions';

@Injectable()
export class GeoSearchEffects {
  @Effect() searchInBox$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.SearchInBox>(LocalActions.GeoSearchActionTypes.SEARCH_IN_BOX),
    mergeMap(action =>
      this._geoSearchService.searchBox(action.query).pipe(
        take(1),
        map(results => new LocalActions.GeoSearchComplete(results, action.context))
      )
    )
  );

  @Effect() searchInCircle$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.SearchInCircle>(LocalActions.GeoSearchActionTypes.SEARCH_IN_CIRCLE),
    mergeMap(action =>
      this._geoSearchService.searchCircle(action.query).pipe(
        take(1),
        map(results => new LocalActions.GeoSearchComplete(results, action.context))
      )
    )
  );

  constructor(private readonly _actions$: Actions, private readonly _geoSearchService: GeoSearchService) {}
}
