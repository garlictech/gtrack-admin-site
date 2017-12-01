import { State } from '../index';
import { createSelector } from '@ngrx/store/src/selector';
import { IHikeEditPoiState } from '../state/index';

export const selectHikeEditPoi = (state: State) => state.hikeEditPoi;

export const selectHikeEditDomainPois = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.google.pois),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmAmenity.pois),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmNatural.pois),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmRoute.pois),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.wikipedia.pois),
};

export const selectHikeEditDomainLoading = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.google.loading),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmAmenity.loading),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmNatural.loading),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmRoute.loading),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.wikipedia.loading),
};

export const selectHikeEditDomainOnrouteMarkers = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.google.showOnrouteMarkers),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmAmenity.showOnrouteMarkers),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmNatural.showOnrouteMarkers),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmRoute.showOnrouteMarkers),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.wikipedia.showOnrouteMarkers)
};

export const selectHikeEditDomainOffrouteMarkers = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.google.showOffrouteMarkers),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmAmenity.showOffrouteMarkers),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmNatural.showOffrouteMarkers),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.osmRoute.showOffrouteMarkers),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.wikipedia.showOffrouteMarkers)
};
