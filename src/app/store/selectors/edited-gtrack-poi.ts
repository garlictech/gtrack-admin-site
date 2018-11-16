import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IEditedGTrackPoiState } from '../state/edited-gtrack-poi';
import { ITextualDescription, ILocalizedItem, IPoiStored, IBackgroundImageData } from 'subrepos/provider-client';

import _get from 'lodash-es/get';
import _uniq from 'lodash-es/uniq';

@Injectable()
export class EditedGTrackPoiSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedGTrackPoiState>;

  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getDirty: MemoizedSelector<object, boolean>;
  public getBackgroundImages: MemoizedSelector<object, IBackgroundImageData[]>;
  public getWorking: MemoizedSelector<object, string | null>;
  public getData: MemoizedSelector<object, IPoiStored>;
  public getError: MemoizedSelector<object, any>;

  constructor() {
    this._featureSelector = createFeatureSelector<IEditedGTrackPoiState>('editedGtrackPoi');

    this.getDescriptions = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) =>
      _get(state, 'data.description')
    );

    this.getDirty = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => state.dirty);

    this.getBackgroundImages = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) =>
      _get(state, 'data.backgroundImages')
    );

    this.getWorking = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => state.working);
    this.getData = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => state.data);
    this.getError = createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => _get(state, 'failed'));
  }

  public getDescriptionByLang = (lang: string) => {
    return createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => _get(state, `data.description.${lang}`));
  }

  public getBackgroundOriginalUrls() {
    return createSelector(this._featureSelector, (state: IEditedGTrackPoiState) => {
      return _uniq((<IBackgroundImageData[]>_get(state, 'data.backgroundImages', [])).map(img => img.original.url));
    });
  }
}
