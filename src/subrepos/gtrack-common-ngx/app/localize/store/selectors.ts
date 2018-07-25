import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, MemoizedSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { User } from 'authentication-api-ngx';
import { ILocalizationState } from 'subrepos/localize-ngx';

// The various property selectors. Consider using the reselect package.
@Injectable()
export class LocalizeSelectors {
  public selectFeature: MemoizedSelector<object, ILocalizationState>;
  public currentLanguage: MemoizedSelector<object, string>;
  public descriptionLanguageList: MemoizedSelector<object, string[]>;

  constructor(private _store: Store<any>) {
    this.selectFeature = createFeatureSelector<ILocalizationState>('language');
    this.currentLanguage = createSelector(this.selectFeature, state => _.get(state, 'actualLanguage', null));
    this.descriptionLanguageList = createSelector(this.selectFeature, state => _.get(state, 'descriptionLanguageList', []));
  }

  getCurrentLanguage(): Observable<string> {
    return this._store.select(this.currentLanguage);
  }

  getDescriptionLanguageList(): Observable<string[]> {
    return this._store.select(this.descriptionLanguageList);
  }

  getLanguageSettings(): Observable<ILocalizationState>  {
    return this._store
      .select(this.selectFeature)
      .map(state => ({
        actualLanguage: _.get(state, 'language', 'en_US'),
        descriptionLanguageList: _.get(state, 'descriptionLanguageList', [])
      }));
  }
}
