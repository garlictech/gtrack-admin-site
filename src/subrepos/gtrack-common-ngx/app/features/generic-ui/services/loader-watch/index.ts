import * as fromGenericUiActions from '../../store/actions';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoaderWatchService {
  constructor(private _store: Store<any>) {
    /* EMPTY */
  }

  spinnerOnWorking$(selector, text?: string) {
    return this._store.pipe(
      select(selector),
      tap(working =>
        this._store.dispatch(
          working
            ? new fromGenericUiActions.ShowProgressSpinner(text)
            : new fromGenericUiActions.HideProgressSpinner()
        )
      )
    );
  }
}
