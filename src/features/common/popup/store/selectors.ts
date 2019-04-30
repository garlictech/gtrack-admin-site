import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, PopupState } from './state';

const selectFeature = createFeatureSelector<PopupState>(featureName);

export const getPopup = createSelector(
  selectFeature,
  (state: PopupState) => state.popup
);
