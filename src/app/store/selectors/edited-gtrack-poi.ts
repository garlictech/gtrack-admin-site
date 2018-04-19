import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IEditedGtrackPoiState } from '../state';
import { ITextualDescription, ILocalizedItem, IPoiStored } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Injectable()
export class EditedGTrackPoiSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedGtrackPoiState>;

  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getDirty: MemoizedSelector<object, boolean>;
  public getWorking: MemoizedSelector<object, string | null>;
  public getData: MemoizedSelector<object, IPoiStored>;

  public dataPath = 'editedGtrackPoi.data';

  constructor() {
    this._featureSelector = createFeatureSelector<IEditedGtrackPoiState>('editedGtrackPoi');

    this.getDescriptions = createSelector(this._featureSelector,
      (state: IEditedGtrackPoiState) => _.get(state, 'data.description')
    );

    this.getDirty = createSelector(this._featureSelector,
      (state: IEditedGtrackPoiState) => state.dirty
    );

    this.getWorking = createSelector(this._featureSelector,
      (state: IEditedGtrackPoiState) => state.working
    );

    this.getData = createSelector(this._featureSelector,
      (state: IEditedGtrackPoiState) => state.data
    );

  }
}
