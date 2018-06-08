import { Action } from '@ngrx/store';
import { IBackgroundImageDataStored } from 'app/shared/interfaces/mapillary-image.interface';

export const RESET_IMAGE_STATE = '[HikeEditImage] Reset images';

export const GET_MAPILLARY_IMAGES = '[HikeEditImage] Get Mapillary images';
export const SET_MAPILLARY_IMAGES = '[HikeEditImage] Set Mapillary images';

export class ResetImageState implements Action {
  readonly type = RESET_IMAGE_STATE;
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
  constructor(public images: IBackgroundImageDataStored[]) {}
}

export type AllHikeEditImageActions =
  | ResetImageState
  // Mapillary
  | GetMapillaryImages
  | SetMapillaryImages;
