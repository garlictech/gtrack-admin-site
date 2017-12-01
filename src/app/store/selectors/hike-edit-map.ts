import { State } from '../index';
import { createSelector } from '@ngrx/store/src/selector';
import { IHikeEditMapState } from '../state/index';

export const selectHikeEditMap = (state: State) => state.hikeEditMap;

export const selectHikeEditMapMapId = createSelector(
  selectHikeEditMap, (state: IHikeEditMapState) => state.mapId
);
