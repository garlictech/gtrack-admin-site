import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IEditedGTrackPoiState } from '../state/edited-gtrack-poi';
import { IBackgroundImageData } from 'subrepos/provider-client';

import _get from 'lodash-es/get';
import _uniq from 'lodash-es/uniq';

const featureSelector = createFeatureSelector<IEditedGTrackPoiState>('editedGtrackPoi');

export const getDescriptions = createSelector(featureSelector, (state: IEditedGTrackPoiState) =>
  _get(state, 'data.description')
);
export const getDirty = createSelector(featureSelector, (state: IEditedGTrackPoiState) => state.dirty);
export const getBackgroundImages = createSelector(featureSelector, (state: IEditedGTrackPoiState) =>
  _get(state, 'data.backgroundImages')
);
export const getData = createSelector(featureSelector, (state: IEditedGTrackPoiState) => state.data);
export const getWorking = createSelector(featureSelector, (state: IEditedGTrackPoiState) => state.working);
export const getError = createSelector(featureSelector, (state: IEditedGTrackPoiState) => _get(state, 'failed'));

export const getDescriptionByLang = (lang: string) => {
  return createSelector(featureSelector, (state: IEditedGTrackPoiState) => _get(state, `data.description.${lang}`));
};

export const getBackgroundOriginalUrls = () => {
  return createSelector(featureSelector, (state: IEditedGTrackPoiState) => {
    return _uniq((<IBackgroundImageData[]>_get(state, 'data.backgroundImages', [])).map(img => img.original.url));
  });
};
