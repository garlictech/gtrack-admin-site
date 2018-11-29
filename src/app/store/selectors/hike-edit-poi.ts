import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IHikeEditPoiState } from '../state/hike-edit-poi';
import {
  wikipediaPoiAdapter, googlePoiAdapter, osmAmenityPoiAdapter, osmNaturalPoiAdapter, osmRoutePoiAdapter
} from '../reducer';
import { IExternalPoi } from '../../shared/interfaces';

import _uniqBy from 'lodash-es/uniqBy';
import _cloneDeep from 'lodash-es/cloneDeep';

const featureSelector = createFeatureSelector<IHikeEditPoiState>('hikeEditPoi');

const googlePoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.googlePois);
export const getAllGooglePois = googlePoiAdapter.getSelectors(googlePoiSelector).selectAll;

const osmAmenityPoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.osmAmenityPois);
export const getAllOsmAmenityPois = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector).selectAll;

const osmNaturalPoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.osmNaturalPois);
export const getAllOsmNaturalPois = osmNaturalPoiAdapter.getSelectors(osmNaturalPoiSelector).selectAll;

const osmRoutePoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.osmRoutePois);
export const getAllOsmRoutePois = osmRoutePoiAdapter.getSelectors(osmRoutePoiSelector).selectAll;

const wikipediaPoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.wikipediaPois);
export const getAllWikipediaPois = wikipediaPoiAdapter.getSelectors(wikipediaPoiSelector).selectAll;

const collectedPoiSelector = createSelector(featureSelector, (state: IHikeEditPoiState) => state.collectorPois);
export const getAllCollectorPois = wikipediaPoiAdapter.getSelectors(collectedPoiSelector).selectAll;

const _allPoiSelectorMap = {
  google: getAllGooglePois,
  osmAmenity: getAllOsmAmenityPois,
  osmNatural: getAllOsmNaturalPois,
  osmRoute: getAllOsmRoutePois,
  wikipedia: getAllWikipediaPois,
  collector: getAllCollectorPois
};

export const getMergeSelections = createSelector(featureSelector, (state: IHikeEditPoiState) =>
  state.gTrackPoiMerge.selections
);

export const getMergeSelectionsCount = createSelector(featureSelector, (state: IHikeEditPoiState) =>
  state.gTrackPoiMerge.selections.length
);

export const getSaveablePoisCount = (subdomain) => {
  return createSelector(_allPoiSelectorMap[subdomain], (pois: IExternalPoi[]) =>
    pois.filter(p => p.selected && !p.inGtrackDb).length
  );
};

export const getSelectedCollectorPois = () => {
  return createSelector(getAllCollectorPois, (pois: any[]) =>
    pois.filter(p => p.selected)
  );
};

export const getCollectorPoi = (poiId: string) => {
  return createSelector(getAllCollectorPois, (pois: any[]) => pois.find(poi => poi.id === poiId));
};

export const getCollectorPoisCount = () => {
  return createSelector(getAllCollectorPois, (pois: any[]) => pois.length);
};

export const getPoiPhotos = (subdomain) => {
  return createSelector(_allPoiSelectorMap[subdomain], (pois: IExternalPoi[]) => {
    let _photos = [];
    pois
      .filter(p => p[subdomain].photos && !p.inGtrackDb)
      .map(p => {
        const domainPhotos = _cloneDeep(p[subdomain].photos);
        domainPhotos.map(photo => photo.onRoute = p.onRoute);
        return domainPhotos;
      })
      .map(photoArray => {
        _photos = _photos.concat(photoArray);
      });
    return _uniqBy(_photos, 'original.url');
  });
};

export const getHikeEditPoiContextSelector = (subdomain) => {
  return createSelector(featureSelector, (state: IHikeEditPoiState) => state.contexts[subdomain]);
};

export const getHikeEditPoiContextPropertySelector = (subdomain, property) => {
  return createSelector(featureSelector, (state: IHikeEditPoiState) => state.contexts[subdomain][property]);
};
