import { createFeatureSelector, createSelector } from '@ngrx/store';

import { flickrImageAdapter, mapillaryImageAdapter } from '../reducer';
import { HikeEditImageState } from '../state/hike-edit-image';

const featureSelector = createFeatureSelector<HikeEditImageState>('hikeEditImage');

const mapillaryImageSelector = createSelector(
  featureSelector,
  (state: HikeEditImageState) => state.mapillaryImages
);
export const getAllMapillaryImages = mapillaryImageAdapter.getSelectors(mapillaryImageSelector).selectAll;

const flickrImageSelector = createSelector(
  featureSelector,
  (state: HikeEditImageState) => state.flickrImages
);
export const getAllFlickrImages = flickrImageAdapter.getSelectors(flickrImageSelector).selectAll;

export const getImageMarkerImages = createSelector(
  featureSelector,
  (state: HikeEditImageState) => state.imageMarkerImages.images
);

export const getHikeEditImageContextSelector = subdomain =>
  createSelector(
    featureSelector,
    (state: HikeEditImageState) => state.contexts[subdomain]
  );

export const getHikeEditImageContextPropertySelector = (subdomain, property) =>
  createSelector(
    featureSelector,
    (state: HikeEditImageState) => state.contexts[subdomain][property]
  );
