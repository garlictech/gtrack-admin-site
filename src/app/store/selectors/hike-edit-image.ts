import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IHikeEditImageState } from '../state/hike-edit-image';
import { mapillaryImageAdapter, flickrImageAdapter } from '../reducer';

const featureSelector = createFeatureSelector<IHikeEditImageState>('hikeEditImage');

const mapillaryImageSelector = createSelector(featureSelector, (state: IHikeEditImageState) =>
  state.mapillaryImages
);
export const getAllMapillaryImages = mapillaryImageAdapter.getSelectors(mapillaryImageSelector).selectAll;

const flickrImageSelector = createSelector(featureSelector, (state: IHikeEditImageState) =>
  state.flickrImages
);
export const getAllFlickrImages = flickrImageAdapter.getSelectors(flickrImageSelector).selectAll;

export const getImageMarkerImages = createSelector(featureSelector, (state: IHikeEditImageState) =>
  state.imageMarkerImages.images
);

export const getHikeEditImageContextSelector = (subdomain) => {
  return createSelector(featureSelector, (state: IHikeEditImageState) => state.contexts[subdomain]);
};

export const getHikeEditImageContextPropertySelector = (subdomain, property) => {
  return createSelector(featureSelector, (state: IHikeEditImageState) => state.contexts[subdomain][property]);
};
