import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeProgramState } from '../state';

const featureSelector = createFeatureSelector<IHikeProgramState>('hikeProgram');

export const selectDescriptions = createSelector(featureSelector, (state: IHikeProgramState) => state.data.description);

export const selectDirty = createSelector(featureSelector, (state: IHikeProgramState) => state.dirty);

export const selectWorking = createSelector(featureSelector, (state: IHikeProgramState) => state.working);

export const selectData = createSelector(featureSelector, (state: IHikeProgramState) => state.data);

export const dataPath = 'hikeProgram.data';
