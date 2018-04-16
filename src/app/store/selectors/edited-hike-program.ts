import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { IEditedHikeProgramState } from '../state';

const featureSelector = createFeatureSelector<IEditedHikeProgramState>('editedHikeProgram');

export const selectDescriptions = createSelector(
  featureSelector,
  (state: IEditedHikeProgramState) => state.data.description
);

export const selectDirty = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.dirty);

export const selectWorking = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.working);

export const selectData = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.data);

export const selectError = createSelector(featureSelector, (state: IEditedHikeProgramState) =>
  _.get(state, 'failed.data')
);

export const dataPath = 'editedHikeProgram.data';
export const remiteErrorDataPath = 'editedHikeProgram.failed.data';
