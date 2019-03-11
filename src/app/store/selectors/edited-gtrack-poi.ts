import _get from 'lodash-es/get';
import _uniq from 'lodash-es/uniq';

import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EditedGTrackPoiState } from '../state/edited-gtrack-poi';

const featureSelector = createFeatureSelector<EditedGTrackPoiState>('editedGtrackPoi');

export const getDescriptions = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => _get(state, 'data.description')
);
export const getDirty = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => state.dirty
);
export const getBackgroundImages = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => _get(state, 'data.backgroundImages')
);
export const getData = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => state.data
);
export const getWorking = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => state.working
);
export const getError = createSelector(
  featureSelector,
  (state: EditedGTrackPoiState) => _get(state, 'failed')
);

export const getDescriptionByLang = (lang: string) =>
  createSelector(
    featureSelector,
    (state: EditedGTrackPoiState) => _get(state, `data.description.${lang}`)
  );

export const getBackgroundOriginalUrls = () =>
  createSelector(
    featureSelector,
    (state: EditedGTrackPoiState) =>
      _uniq((_get(state, 'data.backgroundImages', []) as Array<BackgroundImageData>).map(img => img.original.url))
  );
