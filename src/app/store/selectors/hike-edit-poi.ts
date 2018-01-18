import { State } from '../index';
import { createSelector, createFeatureSelector } from '@ngrx/store/src/selector';
import { IHikeEditPoiState } from '../state/index';
import {
  wikipediaPoiAdapter, googlePoiAdapter, osmAmenityPoiAdapter, osmNaturalPoiAdapter, osmRoutePoiAdapter
} from 'app/store/reducer';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

export const hikeEditPoiSelector = createFeatureSelector<IHikeEditPoiState>('hikeEditPoi');

/**
 * Context
 */

export function getHikeEditContextSelector(poiType, property) {
  return createSelector(hikeEditPoiSelector,
    (state: IHikeEditPoiState) => state.contexts[poiType][property]);
};

/**
 * Poi lists
 */
const wikipediaPoiSelector = createSelector(
  this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.wikipediaPois
);
export const {
  selectAll: selectAllWikipediaPois
} = wikipediaPoiAdapter.getSelectors(wikipediaPoiSelector);

const googlePoiSelector = createSelector(
  this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.googlePois
);
export const {
  selectAll: selectAllGooglePois
} = googlePoiAdapter.getSelectors(googlePoiSelector);

const osmAmenityPoiSelector = createSelector(
  this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmAmenityPois
);
export const {
  selectAll: selectAllOsmAmenityPois
} = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector);

const osmNaturalPoiSelector = createSelector(
  this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmNaturalPois
);
export const {
  selectAll: selectAllOsmNaturalPois
} = osmNaturalPoiAdapter.getSelectors(osmNaturalPoiSelector);

const osmRoutePoiSelector = createSelector(
  this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmRoutePois
);
export const {
  selectAll: selectAllOsmRoutePois
} = osmRoutePoiAdapter.getSelectors(osmRoutePoiSelector);
