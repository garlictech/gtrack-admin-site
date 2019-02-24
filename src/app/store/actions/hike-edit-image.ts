import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';

import { BackgroundImageDataStored } from '../../shared/interfaces/mapillary-image.interface';

export const RESET_IMAGE_STATE = '[HikeEditImage] Reset images';

export const GET_MAPILLARY_IMAGES = '[HikeEditImage] Get Mapillary images';
export const SET_MAPILLARY_IMAGES = '[HikeEditImage] Set Mapillary images';

export const GET_FLICKR_IMAGES = '[HikeEditImage] Get Flickr images';
export const SET_FLICKR_IMAGES = '[HikeEditImage] Set Flickr images';

export const ADD_IMAGE_MARKER = '[HikeEditImage] Add image marker';
export const ADD_IMAGE_MARKERS = '[HikeEditImage] Add image markers';
export const REMOVE_IMAGE_MARKER = '[HikeEditImage] Remove image marker';
export const REMOVE_IMAGE_MARKERS = '[HikeEditImage] Remove image markers';

export class ResetImageState implements Action {
  readonly type = RESET_IMAGE_STATE;
}

/**
 * Mapillary images
 */

export class GetMapillaryImages implements Action {
  readonly type = GET_MAPILLARY_IMAGES;
  constructor(public bounds: any, public path: any) {}
}

export class SetMapillaryImages implements Action {
  readonly type = SET_MAPILLARY_IMAGES;
  constructor(public images: Array<BackgroundImageDataStored>) {}
}

/**
 * Flickr images
 */

export class GetFlickrImages implements Action {
  readonly type = GET_FLICKR_IMAGES;
  constructor(public bounds: any, public path: any) {}
}

export class SetFlickrImages implements Action {
  readonly type = SET_FLICKR_IMAGES;
  constructor(public images: Array<BackgroundImageDataStored>) {}
}

/**
 * Image markers
 */

export class AddImageMarker implements Action {
  readonly type = ADD_IMAGE_MARKER;
  constructor(public image: BackgroundImageData) {}
}

export class AddImageMarkers implements Action {
  readonly type = ADD_IMAGE_MARKERS;
  constructor(public images: Array<BackgroundImageData>) {}
}

export class RemoveImageMarker implements Action {
  readonly type = REMOVE_IMAGE_MARKER;
  constructor(public image: BackgroundImageData) {}
}

export class RemoveImageMarkers implements Action {
  readonly type = REMOVE_IMAGE_MARKERS;
  constructor(public images: Array<BackgroundImageData>) {}
}

export type AllHikeEditImageActions =
  | ResetImageState
  // Mapillary
  | GetMapillaryImages
  | SetMapillaryImages
  // Flickr
  | GetFlickrImages
  | SetFlickrImages
  // Image markers
  | AddImageMarker
  | AddImageMarkers
  | RemoveImageMarker
  | RemoveImageMarkers;
