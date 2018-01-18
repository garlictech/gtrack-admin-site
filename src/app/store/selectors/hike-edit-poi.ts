import { State } from '../index';
import { createSelector, createFeatureSelector } from '@ngrx/store/src/selector';
import { IHikeEditPoiState } from '../state/index';
import { googlePoiAdapter, osmAmenityPoiAdapter } from 'app/store/reducer';

export const selectHikeEditPoi = createFeatureSelector<IHikeEditPoiState>('hikeEditPoi');

export const selectHikeEditPoiListContext = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.google),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmAmenity),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmNatural),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmRoute),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.wikipedia)
};

const googlePoiSelector = createSelector(this.selectHikeEditPoi, (state: IHikeEditPoiState) => state.googlePois);
const {
  selectIds: selectGooglePoiIds ,
  selectEntities: selectGooglePoiEntities,
  selectAll: selectAllGooglePois,
  selectTotal: selectGooglePoiCount
} = googlePoiAdapter.getSelectors(googlePoiSelector);

const osmAmenityPoiSelector = createSelector(this.selectHikeEditPoi, (state: IHikeEditPoiState) => state.osmAmenityPois);
const {
  selectIds: selectOsmAmenityPoiIds ,
  selectEntities: selectOsmAmenityPoiEntities,
  selectAll: selectAllOsmAmenityPois,
  selectTotal: selectOsmAmenityPoiCount
} = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector);

const osmNaturalPoiSelector = createSelector(this.selectHikeEditPoi, (state: IHikeEditPoiState) => state.osmNaturalPois);
const {
  selectIds: selectOsmNaturalPoiIds ,
  selectEntities: selectOsmNaturalPoiEntities,
  selectAll: selectAllOsmNaturalPois,
  selectTotal: selectOsmNaturalPoiCount
} = osmAmenityPoiAdapter.getSelectors(osmNaturalPoiSelector);

export const poiSelectors = {
  wikipedia: {
    all: selectAllGooglePois,
    entities: selectGooglePoiEntities,
    total: selectGooglePoiCount
  },
  google: {
    all: selectAllGooglePois,
    entities: selectGooglePoiEntities,
    total: selectGooglePoiCount
  },
  osmAmenity: {
    all: selectAllOsmAmenityPois,
    entities: selectOsmAmenityPoiEntities,
    total: selectOsmAmenityPoiCount
  },
  osmNatural: {
    all: selectAllOsmNaturalPois,
    entities: selectOsmNaturalPoiEntities,
    total: selectOsmNaturalPoiCount
  },
  osmRoute: {
    all: selectAllOsmNaturalPois,
    entities: selectOsmNaturalPoiEntities,
    total: selectOsmNaturalPoiCount
  }
}

export const selectHikeEditPoiList = {
  google: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.googlePois.entities.se),
  osmAmenity: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmAmenity),
  osmNatural: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmNatural),
  osmRoute: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.osmRoute),
  wikipedia: createSelector(selectHikeEditPoi,
    (state: IHikeEditPoiState) => state.contexts.entities.wikipedia)
};
