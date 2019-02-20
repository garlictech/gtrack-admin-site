import { BackgroundImageData } from 'subrepos/provider-client';

import { EntityState } from '@ngrx/entity';

import { BackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';

export interface MapillaryImageEntityState extends EntityState<BackgroundImageDataStored> {}
export interface FlickrImageEntityState extends EntityState<BackgroundImageDataStored> {}

export interface ImageListContextItemState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
}

export interface ImageMarkerState {
  images: Array<BackgroundImageData>;
}

export interface ImageListContextState {
  mapillary: ImageListContextItemState;
  flickr: ImageListContextItemState;
}

// State
export interface HikeEditImageState {
  mapillaryImages: MapillaryImageEntityState;
  flickrImages: FlickrImageEntityState;
  imageMarkerImages: ImageMarkerState;
  contexts: ImageListContextState;
}
