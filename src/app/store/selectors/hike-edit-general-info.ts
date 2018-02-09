import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store/src/selector';
import { State } from '../index';
import { IHikeEditGeneralInfoState } from '../state/index';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { textualDescriptionAdapter } from '../reducer/hike-edig-general-info';

@Injectable()
export class HikeEditGeneralInfoSelectors {
  public hikeEditGeneralInfoSelector: MemoizedSelector<object, IHikeEditGeneralInfoState>;
  public getAllTextualDescriptions: (state: object) => ITextualDescriptionItem[];
  public getAllLangKeys: (state: object) => string[] | number[];

  constructor() {
    this.hikeEditGeneralInfoSelector = createFeatureSelector<IHikeEditGeneralInfoState>('hikeEditGeneralInfo');

    const textualDescriptionSelector = createSelector(
      this.hikeEditGeneralInfoSelector, (state: IHikeEditGeneralInfoState) => state.textualDescriptions
    );
    this.getAllTextualDescriptions = textualDescriptionAdapter.getSelectors(textualDescriptionSelector).selectAll;
    this.getAllLangKeys = textualDescriptionAdapter.getSelectors(textualDescriptionSelector).selectIds;
  }
}
