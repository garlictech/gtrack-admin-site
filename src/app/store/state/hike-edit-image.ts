import { EntityAdapter, EntityState } from '@ngrx/entity';
import { IBackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';

export interface IMapillaryImageEntityState extends EntityState<IBackgroundImageDataStored> {};

export interface IImageListContextItemState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
}

export interface IImageListContextState {
  mapillary: IImageListContextItemState;
}

// State
export interface IHikeEditImageState {
  mapillaryImages: IMapillaryImageEntityState;
  contexts: IImageListContextState;
}
