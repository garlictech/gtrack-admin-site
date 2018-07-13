import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from '../../store';

import * as _ from 'lodash';

// The various property selectors. Consider using the reselect package.
@Injectable()
export class Selectors {
  constructor(private _store: Store<State>) {}

  getCurrentLanguage(): Observable<string> {
    console.log('getCurrentLanguage');
    return this._store.select(s => _.get(s, 'actualLanguage'));
  }
}
