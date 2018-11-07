import { EntityState } from '@ngrx/entity';
import { IBackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';
import { IBackgroundImageData } from 'subrepos/provider-client';

export interface IMapillaryImageEntityState extends EntityState<IBackgroundImageDataStored> {}
export interface IFlickrImageEntityState extends EntityState<IBackgroundImageDataStored> {}

export interface IImageListContextItemState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
}

export interface IImageMarkerState {
  images: IBackgroundImageData[];
}

export interface IImageListContextState {
  mapillary: IImageListContextItemState;
  flickr: IImageListContextItemState;
}

// State
export interface IHikeEditImageState {
  mapillaryImages: IMapillaryImageEntityState;
  flickrImages: IFlickrImageEntityState;
  imageMarkerImages: IImageMarkerState;
  contexts: IImageListContextState;
}
