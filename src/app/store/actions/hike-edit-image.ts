import { Action } from '@ngrx/store';
import { IMapillaryImageStored } from '../../shared/interfaces/mapillary-image.interface';

export const RESET_MAPILLARY_IMAGE_STATE = '[HikeEditImage] Reset Mapillary images';

export const GET_MAPILLARY_IMAGES = '[HikeEditImage] Get Mapillary images';
export const SET_MAPILLARY_IMAGES = '[HikeEditImage] Set Mapillary images';

export class ResetMapillaryImageState implements Action {
  readonly type = RESET_MAPILLARY_IMAGE_STATE;
}

/**
 * Mapillary images
 */

export class GetMapillaryImages implements Action {
  readonly type = GET_MAPILLARY_IMAGES;
  constructor(public bounds: any) {}
}

export class SetMapillaryImages implements Action {
  readonly type = SET_MAPILLARY_IMAGES;
  constructor(public images: IMapillaryImageStored[]) {}
}

export type AllHikeEditImageActions =
  | ResetMapillaryImageState
  // Mapillary
  | GetMapillaryImages
  | SetMapillaryImages;
