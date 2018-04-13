import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { IEditedGtrackPoiState } from '../state';

const featureSelector = createFeatureSelector<IEditedGtrackPoiState>('editedGtrackPoi');

export const selectDescriptions = createSelector(featureSelector, (state: IEditedGtrackPoiState) =>
  _.get(state, 'data.description')
);

export const selectDirty = createSelector(featureSelector, (state: IEditedGtrackPoiState) => state.dirty);

export const selectWorking = createSelector(featureSelector, (state: IEditedGtrackPoiState) => state.working);

export const selectData = createSelector(featureSelector, (state: IEditedGtrackPoiState) => state.data);

export const dataPath = 'editedGtrackPoi.data';
