import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IState, featureName } from './state';

export const featureSelector = createFeatureSelector<IState>(featureName);

export const getMapId = createSelector(featureSelector, (state: IState) => state.mapId);
