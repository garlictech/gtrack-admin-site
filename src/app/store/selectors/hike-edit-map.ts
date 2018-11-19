import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IHikeEditMapState } from '../state/hike-edit-map';

const featureSelector = createFeatureSelector<IHikeEditMapState>('hikeEditMap');

export const getMapId = createSelector(featureSelector, (state: IHikeEditMapState) => state.mapId);
