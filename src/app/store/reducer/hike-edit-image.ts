import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IBackgroundImageDataStored } from '../../shared/interfaces';
import { IMapillaryImageEntityState, IImageListContextState, IHikeEditImageState } from '../index';
import { hikeEditImageActions } from '../actions';
import { IImageMarkerState, IFlickrImageEntityState } from '../state';

import _cloneDeep from 'lodash-es/cloneDeep';

/**
 * Mapillary
 */

export const mapillaryImageAdapter: EntityAdapter<IBackgroundImageDataStored> = createEntityAdapter<
  IBackgroundImageDataStored
>();
export const mapillaryImageInitialState = mapillaryImageAdapter.getInitialState();

export function mapillaryImageReducer(
  state: IMapillaryImageEntityState = mapillaryImageInitialState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IMapillaryImageEntityState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE: {
      return mapillaryImageInitialState;
    }

    case hikeEditImageActions.SET_MAPILLARY_IMAGES: {
      return mapillaryImageAdapter.addAll(action.images, state);
    }

    default:
      return state;
  }
}

/**
 * Flickr
 */

export const flickrImageAdapter: EntityAdapter<IBackgroundImageDataStored> = createEntityAdapter<
  IBackgroundImageDataStored
>();
export const flickrImageInitialState = flickrImageAdapter.getInitialState();

export function flickrImageReducer (
  state: IFlickrImageEntityState = flickrImageInitialState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IFlickrImageEntityState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE: {
      return flickrImageInitialState;
    }

    case hikeEditImageActions.SET_FLICKR_IMAGES: {
      return flickrImageAdapter.addAll(action.images, state);
    }

    default:
      return state;
  }
}

/**
 * Context
 */

export const initialImageMarkerState: IImageMarkerState = {
  images: []
};

export function imageMarkerReducer(
  state = initialImageMarkerState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IImageMarkerState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE:
      return initialImageMarkerState;

    /**
     * Image marker urls
     */
    case hikeEditImageActions.ADD_IMAGE_MARKER: {
      return {
        ...state,
        images: [...(<any>state.images), action.image]
      };
    }

    case hikeEditImageActions.ADD_IMAGE_MARKERS: {
      return {
        ...state,
        images: [...(<any>state.images), ...action.images]
      };
    }

    case hikeEditImageActions.REMOVE_IMAGE_MARKER: {
      return {
        ...state,
        images: (<any>state.images).filter(img => img.original.url !== action.image.original.url)
      };
    }

    case hikeEditImageActions.REMOVE_IMAGE_MARKERS: {
      return {
        ...state,
        images: (<any>state.images).filter(img => !(action.images.map(i => i.original.url).includes(img.original.url)))
      };
    }

    default:
      return state;
  }
}

/**
 * Context
 */

const initialContextItemState = {
  loading: false,
  loaded: false,
  saving: false
};

export const imageListInitialContextState: IImageListContextState = {
  mapillary: _cloneDeep(initialContextItemState),
  flickr: _cloneDeep(initialContextItemState)
};

export function imageListContextReducer(
  state = imageListInitialContextState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IImageListContextState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE:
      return imageListInitialContextState;

    /**
     * Mapillary
     */
    case hikeEditImageActions.GET_MAPILLARY_IMAGES: {
      return {
        ...state,
        mapillary: {
          ...state.mapillary,
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditImageActions.SET_MAPILLARY_IMAGES: {
      return {
        ...state,
        mapillary: {
          ...state.mapillary,
          loading: false,
          loaded: true
        }
      };
    }

    /**
     * Flickr
     */
    case hikeEditImageActions.GET_FLICKR_IMAGES: {
      return {
        ...state,
        flickr: {
          ...state.flickr,
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditImageActions.SET_FLICKR_IMAGES: {
      return {
        ...state,
        flickr: {
          ...state.flickr,
          loading: false,
          loaded: true
        }
      };
    }

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditImageState> = {
  mapillaryImages: mapillaryImageReducer,
  flickrImages: flickrImageReducer,
  imageMarkerImages: imageMarkerReducer,
  contexts: imageListContextReducer
};

export const hikeEditImageReducer = combineReducers(reducerMap);
