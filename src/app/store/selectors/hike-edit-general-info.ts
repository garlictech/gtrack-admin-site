import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store/src/selector';
import { State } from '../index';
import { IHikeEditGeneralInfoState } from '../state/index';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { descriptionAdapter } from '../reducer/hike-edig-general-info';

@Injectable()
export class HikeEditGeneralInfoSelectors {
  public hikeEditGeneralInfoSelector: MemoizedSelector<object, IHikeEditGeneralInfoState>;
  public getAllDescriptions: (state: object) => ITextualDescriptionItem[];
  public getAllLangKeys: (state: object) => string[] | number[];

  constructor() {
    this.hikeEditGeneralInfoSelector = createFeatureSelector<IHikeEditGeneralInfoState>('hikeEditGeneralInfo');

    const descriptionSelector = createSelector(
      this.hikeEditGeneralInfoSelector, (state: IHikeEditGeneralInfoState) => state.descriptions
    );
    this.getAllDescriptions = descriptionAdapter.getSelectors(descriptionSelector).selectAll;
    this.getAllLangKeys = descriptionAdapter.getSelectors(descriptionSelector).selectIds;
  }

  public getHikeEditGeneralInfoSelector() {
    return createSelector(this.hikeEditGeneralInfoSelector,
      (state: IHikeEditGeneralInfoState) => state.generalInfo);
  };
}
