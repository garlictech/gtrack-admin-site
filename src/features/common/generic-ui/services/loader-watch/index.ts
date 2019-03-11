import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import * as fromGenericUiActions from '../../store/actions';

@Injectable({
  providedIn: 'root'
})
export class LoaderWatchService {
  constructor(private readonly _store: Store<any>) {
    // EMPTY
  }

  spinnerOnWorking$(selectors, text?: string): any {
    const selectorArray = _.isArray(selectors) ? selectors : [selectors];
    const loaderSelector = createSelector.apply(undefined, [...selectorArray, (...args) => _.some(args)]);

    return this._store.pipe(
      select(loaderSelector),
      tap(working =>
        this._store.dispatch(
          working ? new fromGenericUiActions.ShowProgressSpinner(text) : new fromGenericUiActions.HideProgressSpinner()
        )
      )
    );
  }
}
