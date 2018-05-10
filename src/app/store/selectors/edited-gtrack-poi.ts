import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IEditedGTrackPoiState } from '../state/edited-gtrack-poi';
import { ITextualDescription, ILocalizedItem, IPoiStored } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Injectable()
export class EditedGTrackPoiSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedGTrackPoiState>;

  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getDirty: MemoizedSelector<object, boolean>;
  public getWorking: MemoizedSelector<object, string | null>;
  public getData: MemoizedSelector<object, IPoiStored>;
  public getError: MemoizedSelector<object, any>;

  public dataPath = 'editedGtrackPoi.data';

  constructor() {
    this._featureSelector = createFeatureSelector<IEditedGTrackPoiState>('editedGtrackPoi');

    this.getDescriptions = createSelector(this._featureSelector,
      (state: IEditedGTrackPoiState) => _.get(state, 'data.description')
    );

    this.getDirty = createSelector(this._featureSelector,
      (state: IEditedGTrackPoiState) => state.dirty
    );

    this.getWorking = createSelector(this._featureSelector,
      (state: IEditedGTrackPoiState) => state.working
    );

    this.getData = createSelector(this._featureSelector,
      (state: IEditedGTrackPoiState) => state.data
    );

    this.getError = createSelector(this._featureSelector,
      (state: IEditedGTrackPoiState) => _.get(state, 'failed')
    );

  }
}
