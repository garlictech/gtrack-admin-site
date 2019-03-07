import _cloneDeep from 'lodash-es/cloneDeep';
import _uniqBy from 'lodash-es/uniqBy';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ExternalPoi } from '../../shared/interfaces';
import {
  googlePoiAdapter,
  osmAmenityPoiAdapter,
  osmNaturalPoiAdapter,
  osmRoutePoiAdapter,
  wikipediaPoiAdapter
} from '../reducer';
import { HikeEditPoiState } from '../state/hike-edit-poi';

const featureSelector = createFeatureSelector<HikeEditPoiState>('hikeEditPoi');

const googlePoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.googlePois
);
export const getAllGooglePois = googlePoiAdapter.getSelectors(googlePoiSelector).selectAll;

const osmAmenityPoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.osmAmenityPois
);
export const getAllOsmAmenityPois = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector).selectAll;

const osmNaturalPoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.osmNaturalPois
);
export const getAllOsmNaturalPois = osmNaturalPoiAdapter.getSelectors(osmNaturalPoiSelector).selectAll;

const osmRoutePoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.osmRoutePois
);
export const getAllOsmRoutePois = osmRoutePoiAdapter.getSelectors(osmRoutePoiSelector).selectAll;

const wikipediaPoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.wikipediaPois
);
export const getAllWikipediaPois = wikipediaPoiAdapter.getSelectors(wikipediaPoiSelector).selectAll;

const collectedPoiSelector = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.collectorPois
);
export const getAllCollectorPois = wikipediaPoiAdapter.getSelectors(collectedPoiSelector).selectAll;

const _allPoiSelectorMap = {
  google: getAllGooglePois,
  osmAmenity: getAllOsmAmenityPois,
  osmNatural: getAllOsmNaturalPois,
  osmRoute: getAllOsmRoutePois,
  wikipedia: getAllWikipediaPois,
  collector: getAllCollectorPois
};

export const getMergeSelections = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.gTrackPoiMerge.selections
);

export const getMergeSelectionsCount = createSelector(
  featureSelector,
  (state: HikeEditPoiState) => state.gTrackPoiMerge.selections.length
);

export const getSaveablePoisCount = subdomain =>
  createSelector(
    _allPoiSelectorMap[subdomain],
    (pois: Array<ExternalPoi>) => pois.filter(p => p.selected && !p.inGtrackDb).length
  );

export const getSelectedCollectorPois = () =>
  createSelector(
    getAllCollectorPois,
    (pois: Array<any>) => pois.filter(p => p.selected)
  );

export const getCollectorPoi = (poiId: string) =>
  createSelector(
    getAllCollectorPois,
    (pois: Array<any>) => pois.find(poi => poi.id === poiId)
  );

export const getCollectorPoisCount = () =>
  createSelector(
    getAllCollectorPois,
    (pois: Array<any>) => pois.length
  );

export const getPoiPhotos = subdomain =>
  createSelector(
    _allPoiSelectorMap[subdomain],
    (pois: Array<ExternalPoi>) => {
      let _photos = [];
      pois
        .filter(p => p[subdomain].photos && !p.inGtrackDb)
        .map(p => {
          const domainPhotos = _cloneDeep(p[subdomain].photos);
          domainPhotos.map(photo => (photo.onRoute = p.onRoute));

          return domainPhotos;
        })
        .forEach(photoArray => {
          _photos = _photos.concat(photoArray);
        });

      return _uniqBy(_photos, 'original.url');
    }
  );

export const getHikeEditPoiContextSelector = subdomain =>
  createSelector(
    featureSelector,
    (state: HikeEditPoiState) => state.contexts[subdomain]
  );

export const getHikeEditPoiContextPropertySelector = (subdomain, property) =>
  createSelector(
    featureSelector,
    (state: HikeEditPoiState) => state.contexts[subdomain][property]
  );
