import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
<<<<<<< HEAD
import _get from 'lodash-es/get';
=======
import * as _ from 'lodash';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { Observable } from 'rxjs';

import { ILocalizationState } from 'subrepos/localize-ngx';

const selectFeature = createFeatureSelector<ILocalizationState>('language');

export const currentLanguage = createSelector(selectFeature, state => _get(state, 'actualLanguage', null));

export const descriptionLanguageList = createSelector(selectFeature, state =>
  _get(state, 'descriptionLanguageList', [])
);

// The various property selectors. Consider using the reselect package.
@Injectable()
export class LocalizeSelectors {
  constructor(private _store: Store<any>) {
    /* EMPTY */
  }

  getCurrentLanguage(): Observable<string> {
    return this._store.pipe(select(currentLanguage));
  }

  getDescriptionLanguageList(): Observable<string[]> {
    return this._store.pipe(select(descriptionLanguageList));
  }

  getLanguageSettings(): Observable<ILocalizationState> {
<<<<<<< HEAD
    return this._store.pipe(
      select(selectFeature),
      map(state => ({
        actualLanguage: _get(state, 'language', 'en_US'),
        descriptionLanguageList: _get(state, 'descriptionLanguageList', [])
      }))
    );
=======
    return this._store
      .pipe(
        select(selectFeature),
        map(state => ({
          actualLanguage: _.get(state, 'language', 'en_US'),
          descriptionLanguageList: _.get(state, 'descriptionLanguageList', [])
        }))
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }
}
