import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeProgram } from 'subrepos/provider-client';

const featureSelector = createFeatureSelector<IHikeProgram>('hikeProgram');

export const selectDescriptions = createSelector(featureSelector, (state: IHikeProgram) => state.description);

export const dataPath = 'hikeProgram';
